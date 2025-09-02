import pandas as pd
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler, LabelEncoder # <-- Import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
from sklearn.metrics import classification_report, accuracy_score

# === Load the FULL dataset ===
try:
    df = pd.read_csv("/content/drive/MyDrive/Final project/insurance_dataset.csv")
    print("Full dataset loaded successfully.")
except FileNotFoundError:
    print("Error: insurance_dataset.csv not found.")
    print("Please make sure you have uploaded the dataset to your Colab session.")
    exit()

# === Define features and target ===
features = ['age', 'bmi', 'children', 'gender', 'smoker', 'region',
            'medical_history', 'family_medical_history', 'exercise_frequency',
            'occupation', 'charges']
target = 'coverage_level'

X = df[features]
y = df[target]

print(f"\nFeatures being used: {X.columns.tolist()}")

# === FIX: Encode the target variable (y) into numbers ===
le = LabelEncoder()
y_encoded = le.fit_transform(y)
print(f"\nOriginal labels: {le.classes_}")
print(f"Encoded labels: {le.transform(le.classes_)}")


# === Feature types ===
categorical_features = ['gender', 'smoker', 'region', 'medical_history',
                        'family_medical_history', 'exercise_frequency', 'occupation']
numerical_features = ['age', 'bmi', 'children', 'charges']

# === Preprocessing Pipelines ===
categorical_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
    ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
])

numerical_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='mean')),
    ('scaler', StandardScaler())
])

preprocessor = ColumnTransformer([
    ('cat', categorical_pipeline, categorical_features),
    ('num', numerical_pipeline, numerical_features)
], remainder='passthrough')


# === Train/Test Split ===
# Use the new y_encoded for training
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, stratify=y_encoded, test_size=0.2, random_state=42)
print(f"\nTraining set shape: {X_train.shape}")
print(f"Testing set shape: {X_test.shape}")


# === Define Models to Compare ===
# Note: XGBoost no longer needs use_label_encoder=False as we've done it ourselves
models = {
    "Random Forest": RandomForestClassifier(n_estimators=100, max_depth=15, random_state=42, class_weight='balanced', n_jobs=-1),
    "XGBoost": XGBClassifier(eval_metric='mlogloss', random_state=42, n_jobs=-1),
    "LightGBM": LGBMClassifier(random_state=42, class_weight='balanced', n_jobs=-1)
}

best_model = None
best_accuracy = 0.0
best_model_name = ""

# === Train, Evaluate, and Compare Models ===
for name, model in models.items():
    print(f"\n--- Training {name} ---")

    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', model)
    ])

    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    # We need to convert predictions back to original labels for the report
    y_test_labels = le.inverse_transform(y_test)
    y_pred_labels = le.inverse_transform(y_pred)

    print(f"✅ Accuracy for {name}: {accuracy:.4f}")
    print(f"Classification Report for {name}:")
    print(classification_report(y_test_labels, y_pred_labels))

    if accuracy > best_accuracy:
        best_accuracy = accuracy
        best_model = pipeline
        best_model_name = name

print("---" * 10)
print(f"\n🏆 Best performing model: {best_model_name} with an accuracy of {best_accuracy:.4f}")

# === Save the Best Model ===
if best_model:
    os.makedirs("model", exist_ok=True)
    model_filename = "/content/drive/MyDrive/Final project/model/best_insurance_model.pkl"
    joblib.dump(best_model, os.path.join("model", model_filename))
    print(f"\n✅ Best model saved as {model_filename}")