import { useState } from "react";
import { login, register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleSubmit = async(e) => {
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

      if (
        formData.password !== formData.confirmPassword
      ) {
        setError("Passwords do not match.");
        return;
      }

      try {

    await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
    });

    setSuccess("Account created successfully!");

   setTimeout(() => {

    setIsSignup(false);

    setFormData({
        fullName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

}, 1000);

} catch (err) {
    console.log(err.response);
    console.log(err.response?.data);

    if (err.response?.data) {
        const errors = Object.values(err.response.data)
            .flat()
            .join(" ");

        setError(errors);
    } else {
        setError("Registration failed.");
    }
}



      return;
    }

    try {

    const response = await login(
        formData.username,
        formData.password
    );

    localStorage.setItem(
        "access",
        response.data.access
    );

    localStorage.setItem(
        "refresh",
        response.data.refresh
    );

    setSuccess("Login successful!");

    setTimeout(() => {
        navigate("/dashboard");
    }, 500);

} catch (err) {

    setError("Invalid username or password.");

}
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-header">
          <div className="logo">🎓</div>

          <h1>
            {isSignup
              ? "Create Account"
              : "Welcome Back"}
          </h1>

          <p>
            {isSignup
              ? "Join Academix and start tracking your academics"
              : "Sign in to continue to Academix"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="login-form"
        >

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
            />
          </div>

<div className="input-group">
          <label>Email Address</label>

    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      placeholder="Enter your email"
    />
    </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
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
              />
            </div>
          )}

          {!isSignup && (
            <div className="login-options">
              <label>
                <input type="checkbox" />
                Remember me
              </label>

              <a href="/">
                Forgot Password?
              </a>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="login-btn"
          >
            {isSignup
              ? "Create Account"
              : "Sign In"}
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <button
            type="button"
            className="google-btn"
            onClick={() =>
              alert(
                "Google Authentication will be added later."
              )
            }
          >
            Continue with Google
          </button>

        </form>

        <div className="signup-link">
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}

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
            {isSignup
              ? " Sign In"
              : " Sign Up"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;