from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS
import os
import mysql.connector
from openai import OpenAI 
from dotenv import load_dotenv
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_community.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory

load_dotenv()

app = Flask(__name__)
# The CORS configuration is applied to the entire app,
# which automatically handles preflight OPTIONS requests.
CORS(app)

# === Load the trained model ===
MODEL_PATH = os.getenv("MODEL_PATH", "insurance_model.pkl")
model = joblib.load(MODEL_PATH)

# === MySQL Connection Details ===
MYSQL_HOST = os.getenv("MYSQL_HOST", "127.0.0.1")
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "Kulan@2003")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "insurance_system")

def get_db_connection():
    return mysql.connector.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DATABASE
    )
# === OpenAI Client ===
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY not found in environment")
client = OpenAI(api_key=OPENAI_API_KEY)

# === LangChain Setup ===
llm = ChatOpenAI(
    openai_api_key=OPENAI_API_KEY,
    model_name="gpt-4-turbo",
    temperature=0.7
)

# Create conversation memory
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

# Insurance-specific prompt template
insurance_prompt = PromptTemplate(
    input_variables=["chat_history", "human_input"],
    template="""You are an expert insurance advisor specializing in explaining insurance products in a clear, helpful manner.

Previous conversation:
{chat_history}

New human question: {human_input}

As an insurance expert, please:
1. Provide clear, accurate information about insurance products
2. Explain complex insurance concepts in simple terms
3. Focus on the specific products mentioned in our database
4. Be helpful and professional
5. If asked about a specific product, provide detailed information about its features, benefits, and coverage
6. If the question is too general, ask for clarification about which product they're interested in
7. Keep responses concise but informative

Response:"""
)

# Create LangChain
insurance_chain = LLMChain(
    llm=llm,
    prompt=insurance_prompt,
    memory=memory,
    verbose=True
)

EXPECTED_COLUMNS = [
    'age', 'bmi', 'children', 'gender', 'smoker', 'region',
    'medical_history', 'family_medical_history', 'exercise_frequency',
    'occupation', 'charges'
]

@app.route('/predict', methods=['POST'])
def predict():
    try:
        input_data = request.get_json()
        df = pd.DataFrame([input_data])

        # Check for all required columns for the model
        missing_cols = [col for col in EXPECTED_COLUMNS if col not in df.columns]
        if missing_cols:
            return jsonify({'error': f'Missing fields in input: {missing_cols}'}), 400

        # The model pipeline handles preprocessing internally
        prediction_encoded = model.predict(df)[0]
        
        # We need the LabelEncoder to transform the numeric prediction back to a string
        # This assumes your LabelEncoder was saved or you can recreate it.
        # For simplicity, we'll manually map it here based on your training script output.
        # Original labels: ['Basic' 'Premium' 'Standard']
        # Encoded labels: [0 1 2]
        label_mapping = {0: 'Basic', 1: 'Premium', 2: 'Standard'}
        prediction_label = label_mapping.get(prediction_encoded, "Unknown")
        
        return jsonify({'coverage_level': prediction_label})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/products', methods=['GET', 'POST'])
def handle_products():
    if request.method == 'GET':
        coverage_level = request.args.get('coverage_level')
        company = request.args.get('company')
        class_ = request.args.get('class')
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)
            query = """
                SELECT 
                    p.*, 
                    c.name AS company_name, 
                    cl.name AS class_name
                FROM 
                    products p
                LEFT JOIN companies c ON p.company_id = c.id
                LEFT JOIN classes cl ON p.class_id = cl.id
                WHERE 1=1
            """
            params = []
            if coverage_level:
                query += " AND p.coverage_level = %s"
                params.append(coverage_level)
            if company:
                query += " AND c.name = %s"
                params.append(company)
            if class_:
                query += " AND cl.name = %s"
                params.append(class_)
            
            cursor.execute(query, params)
            products = cursor.fetchall()
            cursor.close()
            conn.close()
            return jsonify({'products': products})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    elif request.method == 'POST':
        try:
            product_data = request.get_json()
            conn = get_db_connection()
            cursor = conn.cursor()
            query = """
                INSERT INTO products (
                    class_id, company_id, name, introduction, purpose, 
                    max_cover_ceasing_age, cover_issuing_age, coverage_level
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            params = (
                product_data['class_id'],
                product_data['company_id'],
                product_data['name'],
                product_data['introduction'],
                product_data['purpose'],
                product_data['max_cover_ceasing_age'],
                product_data['cover_issuing_age'],
                product_data['coverage_level']
            )
            cursor.execute(query, params)
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({'message': 'Product created successfully'}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 500

# Updated route to handle bookings with user_email
@app.route('/bookings', methods=['POST'])
def create_booking():
    try:
        booking_data = request.get_json()
        user_email = booking_data.get('userEmail')
        product_id = booking_data.get('productId')

        if not user_email or not product_id:
            return jsonify({'error': 'userEmail and productId are required'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "INSERT INTO bookings (user_email, product_id) VALUES (%s, %s)"
        params = (user_email, product_id)
        cursor.execute(query, params)
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Booking created successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/companies', methods=['GET'])
def get_companies():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, name FROM companies")
        companies = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify({'companies': companies})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/classes', methods=['GET'])
def get_classes():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, name FROM classes")
        classes = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify({'classes': classes})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# NEW: AI info endpoint
@app.route('/product-info-ai', methods=['POST'])
def product_info_ai():
    try:
        data = request.get_json()
        company_name = data.get("companyName")
        product_name = data.get("productName")
        if not company_name or not product_name:
            return jsonify({'error': 'companyName and productName are required'}), 400
        
        prompt = (
            f"Please provide the latest information or summary about the insurance company '{company_name}' "
            f"and the product '{product_name}'. Focus on key features, strengths, and any recent updates."
        )
        response = client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300
        )
        ai_text = response.choices[0].message.content.strip()
        return jsonify({"info": ai_text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

        # NEW: Chat endpoint with LangChain for comprehensive insurance explanations
@app.route('/insurance-chat', methods=['POST'])
def insurance_chat():
    try:
        data = request.get_json()
        message = data.get("message")
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get available products from database for context
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT p.name as product_name, c.name as company_name, p.introduction, p.purpose
            FROM products p
            LEFT JOIN companies c ON p.company_id = c.id
            LIMIT 20
        """)
        products = cursor.fetchall()
        cursor.close()
        conn.close()
        
        # Add product context to the prompt
        product_context = "Available insurance products:\n"
        for product in products:
            product_context += f"- {product['product_name']} by {product['company_name']}: {product['introduction']}\n"
        
        # Enhanced prompt with product context
        enhanced_prompt = f"""
        {product_context}
        
        Human question: {message}
        
        As an insurance expert, please provide a comprehensive but clear explanation.
        Focus on helping the user understand insurance concepts and products.
        If they mention a specific product, provide detailed information about it.
        Be professional, helpful, and educational in your response.
        """
        
        # Use LangChain for more sophisticated response generation
        response = insurance_chain.run(human_input=enhanced_prompt)
        
        return jsonify({"response": response})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# NEW: Endpoint to get product list for chat context
@app.route('/chat-products', methods=['GET'])
def get_chat_products():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT p.name as product_name, c.name as company_name
            FROM products p
            LEFT JOIN companies c ON p.company_id = c.id
            ORDER BY c.name, p.name
        """)
        products = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify({'products': products})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)