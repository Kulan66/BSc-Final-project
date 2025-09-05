import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ClerkProvider } from "@clerk/clerk-react";
import { store } from "./lib/store";
import "./index.css";

import RootLayout from "./layouts/RootLayout";
import MainLayout from "./layouts/MainLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import AdminProtectedLayout from "./layouts/AdminProtectedLayout";

import HomePage from "./pages/Home.page";
import ChatPage from "./pages/ChatPage";
import ProductsPage from "./pages/Products.page";
import ClassPage from "./pages/Class.page";
import CompaniesPage from "./pages/Companies.page";
import AccountPage from "./pages/Account.page";
import SignInPage from "./pages/SignIn.page";
import SignUpPage from "./pages/SignUp.page";
import CreateInsurancePage from "./pages/CreateInsurance.page";
import BookingsPage from "./pages/Bookings.page";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env.local file");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/class" element={<ClassPage />} />
                <Route path="/companies" element={<CompaniesPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route element={<ProtectedLayout />}>
                  <Route path="/account" element={<AccountPage />} />
                  <Route element={<AdminProtectedLayout />}>
                    <Route path="/insurance/create" element={<CreateInsurancePage />} />
                    <Route path="/bookings" element={<BookingsPage />} />
                  </Route>
                </Route>
              </Route>
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </ClerkProvider>
  </StrictMode>
);