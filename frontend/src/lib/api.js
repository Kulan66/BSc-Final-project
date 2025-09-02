import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_URL,
  }),
  tagTypes: ['Products'], 
  endpoints: (builder) => ({
    predictCoverage: builder.mutation({
      query: (formData) => ({
        url: "/predict",
        method: "POST",
        body: formData,
      }),
    }),
    getProducts: builder.query({
      query: ({ coverage_level, company, className }) => {
        let params = [];
        if (coverage_level) params.push(`coverage_level=${encodeURIComponent(coverage_level)}`);
        if (company && company !== "ALL") params.push(`company=${encodeURIComponent(company)}`);
        if (className && className !== "ALL") params.push(`class=${encodeURIComponent(className)}`);
        return "/products" + (params.length ? `?${params.join("&")}` : "");
      },
      providesTags: ['Products'], 
    }),
    getCompanies: builder.query({
      query: () => "/companies",
    }),
    getClasses: builder.query({
      query: () => "/classes",
    }),
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: '/products',
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: ['Products'], 
    }),
    
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: "/bookings",
        method: "POST",
        body: bookingData,
      }),
    }),
    getProductInfoAI: builder.mutation({
      query: ({ companyName, productName }) => ({
        url: "/product-info-ai",
        method: "POST",
        body: { companyName, productName },
      }),
    }),
    //  Chat endpoint with LangChain
    insuranceChat: builder.mutation({
      query: (message) => ({
        url: "/insurance-chat",
        method: "POST",
        body: { message },
      }),
    }),
    //  Get products for chat context
    getChatProducts: builder.query({
      query: () => "/chat-products",
    }),
  }),
});

export const {
  usePredictCoverageMutation,
  useGetProductsQuery,
  useGetCompaniesQuery,
  useGetClassesQuery,
  useAddProductMutation,
  useCreateBookingMutation,
  useGetProductInfoAIMutation,
  useInsuranceChatMutation,
  useGetChatProductsQuery,
} = api;