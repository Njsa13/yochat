import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignupPage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import SendVerificationEmail from "./pages/SendVerificationEmail.jsx";

function App() {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <div data-theme={theme} className="font-lato">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/send-verification-email" element={<SendVerificationEmail />} />
      </Routes>
    </div>
  );
}

export default App;
