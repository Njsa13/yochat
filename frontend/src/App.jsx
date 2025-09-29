import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import SendVerificationEmail from "./pages/SendVerificationEmail.jsx";
import { useCheckAuthQuery } from "./services/authApi.js";

function App() {
  const theme = useSelector((state) => state.theme.theme);
  const authUser = useSelector((state) => state.auth.user);
  const { isLoading: isLoadingCheck } = useCheckAuthQuery();

  if (isLoadingCheck && !authUser)
    return (
      <div
        data-theme={theme}
        className="flex items-center justify-center h-screen"
      >
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme} className="font-lato">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/verify-email"
          element={!authUser ? <VerifyEmailPage /> : <Navigate to="/" />}
        />
        <Route
          path="/send-verification-email"
          element={!authUser ? <SendVerificationEmail /> : <Navigate to="/" />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
