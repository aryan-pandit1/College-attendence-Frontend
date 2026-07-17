import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import {
  login,
  sendRegistrationOTP,
  verifyRegistrationOTP,
  resendRegistrationOTP,
} from "../services/authService";

import RegisterOTPModal from "../Components/RegisterOTPModal";

// FIXED: Accept darkMode prop sent down from App.jsx routing configurations
const Login = ({ darkMode }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [isSignup, setIsSignup] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showOTPModal, setShowOTPModal] =
    useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  // ⚡ SMART ERROR PARSER: Extracts clean English from Django REST payloads
  const extractErrorMessage = (err) => {
    const data = err?.response?.data;
    if (!data) return "Network error. Please check your internet connection.";

    // 1. If backend sent a direct text string
    if (typeof data === "string") return data;
    if (typeof data.detail === "string") return data.detail;
    if (typeof data.error === "string") return data.error;

    // 2. If Django sent a nested dict: { status: false, message: "...", errors: { ... } }
    const errorSource = data.errors || data;
    const cleanMessages = [];

    Object.entries(errorSource).forEach(([key, val]) => {
      // Ignore metadata flags like status: false or code: 400
      if (["status", "code", "success"].includes(key)) return;

      if (key === "message" && typeof val === "string" && !data.errors) {
        cleanMessages.push(val);
      } else if (Array.isArray(val)) {
        // e.g., username: ["A user with that username already exists."]
        cleanMessages.push(val.join(" "));
      } else if (typeof val === "string") {
        cleanMessages.push(val);
      } else if (typeof val === "object" && val !== null) {
        cleanMessages.push(Object.values(val).flat().join(" "));
      }
    });

    return cleanMessages.length > 0
      ? cleanMessages.join(" ")
      : (data.message || "Validation failed. Please check your inputs.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!formData.username || !formData.password) {
      setError("Please fill all required fields.");
      return;
    }


    if (isSignup) {
      if (!formData.fullName) {
        setError("Full Name is required.");
        return;
      }

      if (!formData.email) {
        setError("Email is required.");
        return;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      // ⚡ STEP 1: SEND OTP (If not sent yet)
      if (!otpSent) {
        try {
          await sendRegistrationOTP({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
          });

          setOtpSent(true);
          setSuccess("OTP sent to your email! Please enter it below to verify.");
        } catch (err) {
          if (err.response?.data) {
            setError(extractErrorMessage(err));
          } else {
            setError("Failed to send verification email. Please try again.");
          }
        }
        return;
      }

      // ⚡ STEP 2: VERIFY OTP & CREATE ACCOUNT (When user clicks Create Account)
      if (otpSent) {
        if (!otp || otp.trim().length === 0) {
          setError("Please enter the verification OTP sent to your email.");
          return;
        }

        try {
          await verifyRegistrationOTP({
            email: formData.email,
            otp: otp.trim(),
            username: formData.username,
            password: formData.password,
            fullName: formData.fullName,
          });

          setSuccess("Account created successfully! Please sign in.");
          setIsSignup(false);
          setOtpSent(false);
          setOtp("");
          setFormData({ fullName: "", username: "", email: "", password: "", confirmPassword: "" });
        } catch (err) {
          if (err.response?.data) {
            setError(extractErrorMessage(err));
            setError(errors || "Invalid OTP. Please try again.");
          } else {
            setError("OTP verification failed. Please check the code.");
          }
        }
        return;
      }
    }

    try {
      const response = await login(formData.username, formData.password);

      const storage = rememberMe
        ? localStorage
        : sessionStorage;

      storage.setItem("access", response.data.access);
      storage.setItem("refresh", response.data.refresh);

      setSuccess("Login successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err) {
      setError("Invalid username or password.");
    }
  };

  return (
    /* FIXED: Dynamic context conditional string matches layout schema configurations */
    <div className={`login-page ${darkMode ? "forced-dark" : ""}`}>
      <div className="login-card">
        <div className="login-header">
          <div className="logo">🎓</div>
          <h1>{isSignup ? "Create Account" : "Welcome Back"}</h1>
          <p>
            {isSignup
              ? "Join Semtrek and start treking your Semister journey!"
              : "Sign in to continue to Semtrek"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {isSignup && (
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div className="input-group">
            <label>User Name</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              disabled={otpSent}
            />
          </div>

          {/* FIXED: Wrapped Email input context dynamically to show up only during signup */}
          {isSignup && (
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={otpSent}
              />
            </div>
          )}
{/* ⚡ INLINE OTP VERIFICATION BOX */}
          {isSignup && otpSent && (
            <div className="input-group" style={{ animation: "fadeIn 0.3s ease-in-out" }}>
              <label style={{ color: "#10b981", fontWeight: "700" }}>
                ✉️ Enter 6-Digit Verification OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP sent to your email"
                maxLength={6}
                style={{
                  border: "2px solid #10b981",
                  backgroundColor: darkMode ? "rgba(16, 185, 129, 0.05)" : "#ecfdf5",
                  letterSpacing: "2px",
                  fontWeight: "700",
                  textAlign: "center",
                }}
              />
            </div>
          )}

          {/* ⚡ RESEND BUTTON (Right-aligned below OTP box) */}
          {isSignup && otpSent && (
            <div style={{ display: "flex", justify: "flex-end", width: "100%" }}>
              <button
                type="button"
                className="resend-btn"
                onClick={async () => {
                  try {
                    await resendRegistrationOTP(formData.email);
                    setSuccess("OTP resent successfully.");
                    setError("");
                  } catch (err) {
                    setError(extractErrorMessage(err));
                  }
                }}
              >
                Resend OTP
              </button>
            </div>
          )}
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={otpSent}
            />
          </div>

          {isSignup && (
            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                disabled={otpSent}
              />
            </div>
          )}

          {!isSignup && (
            <div className="login-options">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                />
                Remember me
              </label>
              <span
                className="forgot-password-link"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </span>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" className="login-btn">
            {isSignup
              ? otpSent
                ? "Create Account"
                : "Verify Email"
              : "Sign In"}
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <button
            type="button"
            className="google-btn"
            onClick={() => alert("Google Authentication will be added later.")}
          >
            Continue with Google
          </button>
        </form>

        <div className="signup-link">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <button
            className="switch-btn"
            onClick={() => {
              setIsSignup(!isSignup);
              resetMessages();
              setFormData({
                fullName: "",
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
              });
            }}
          >
            {isSignup ? " Sign In" : " Sign Up"}
          </button>
        </div>
      </div>
    </div>


  );
};

export default Login;