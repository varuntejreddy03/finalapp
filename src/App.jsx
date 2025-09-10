import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import VerifyOTP from "./pages/Auth/VerifyOTP"; // 1. Import the new page
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import Goals from "./pages/Dashboard/Goals";
import Profile from "./pages/Dashboard/Profile";
import AllTransactions from "./pages/Dashboard/AllTransactions";

import UserProvider from "./context/userContext";
import { Toaster } from "react-hot-toast";
import { isSessionValid } from "./utils/axiosInstance";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            {/* Default route */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-otp" element={<VerifyOTP />} /> {/* 2. Add the new route */}

            {/* Dashboard (protected) */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/income"
              element={
                <PrivateRoute>
                  <Income />
                </PrivateRoute>
              }
            />
            <Route
              path="/expense"
              element={
                <PrivateRoute>
                  <Expense />
                </PrivateRoute>
              }
            />
            <Route
              path="/goals"
              element={
                <PrivateRoute>
                  <Goals />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <PrivateRoute>
                  <AllTransactions />
                </PrivateRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </div>

      <Toaster
        toastOptions={{
          style: { fontSize: "13px" },
        }}
      />
    </UserProvider>
  );
};

export default App;

// Enhanced PrivateRoute with session validation
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = token && isSessionValid();
  
  // If token exists but session is invalid, clear everything
  if (token && !isSessionValid()) {
    localStorage.clear();
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};