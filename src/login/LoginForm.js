import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../img/Logo.svg";
import eyeIcon from "../img/hide-password.svg";
import eyeOffIcon from "../img/hide-password.svg";
import "./LoginForm.css";
import Loginbg from "../img/login-bg-1.svg";
import Loginbgdesk from "../img/login-bg-1-desktop.svg"

const LoginForm = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const endpoint = isRegistering
      ? "http://localhost:5000/log/register"
      : "http://localhost:5000/log/login";

    try {
      const response = await axios.post(endpoint, { email, password });

      if (response.data.success) {
        if (!isRegistering) {
          localStorage.setItem("token", response.data.token);
          setIsAuthenticated(true);
          navigate("/dashboard");
        } else {
          setError("Registration successful! You can now log in.");
          setEmail("");
          setPassword("");
        }
      } else {
        setError(response.data.message || "An error occurred");
      }
    } catch (err) {
      setError(err.response ? err.response.data.message : "An error occurred");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div>
        <img src={Loginbgdesk} alt="Background" className="header" />
        <img src={Loginbg} alt="Background" className="headermobile" />
      </div>
      <div className="app-container">
        <img src={Logo} alt="Company Logo" className="company-logo-login" />
        <img src={Logo} alt="Company Logo" className="company-logo-mobile" />
        <p className="centered-text">Online Project Management</p>
        <div >
          <div className="login-container">
            <form onSubmit={handleSubmit}>
              <h5 align="center">Login to get started</h5>
              <div className="form-group">
                <label htmlFor="email" className="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="password">
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <img
                    src={showPassword ? eyeOffIcon : eyeIcon}
                    alt="Toggle Password Visibility"
                    style={{
                      position: "absolute",
                      right: "20px",
                      top: "40%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
              </div>
              <div className="forgot">
                <a href="/forgot-password">Forgot password?</a>
              </div>
              <div align="center">
              <button type="submit" disabled={isLoading} className="logbtn">
                {isLoading
                  ? isRegistering
                    ? "Registering..."
                    : "Logging in..."
                  : isRegistering
                  ? "Register"
                  : "Login"}
              </button></div>
              {error && (
                <p className="error" aria-live="assertive">
                  {error}
                </p>
              )}
            </form>
            <button onClick={() => setIsRegistering(!isRegistering)} hidden>
              {isRegistering
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default LoginForm;
