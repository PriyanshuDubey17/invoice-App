import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const [isLoading, setIsLoading] = useState(false);
  const Navigate = useNavigate();

  // Function to handle input changes
  const handleInputChange = (event) => {
    setFormData((currentData) => ({
      ...currentData,
      [event.target.name]: event.target.value,
    }));
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to handle form submission
  const formSubmit = (event) => {
    setIsLoading(true); // Show loading spinner before login attempt
    event.preventDefault();
    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        
        console.log("User signed in:", user);
        Navigate("/dashboard");
         // Navigate to dashboard after successful login
         setIsLoading(false);
        localStorage.setItem("companyName", user.displayName);
        localStorage.setItem("imageUrl", user.photoURL);
        localStorage.setItem("email", user.email);
        localStorage.setItem("uid", user.uid);
      })
      .catch((error) => {
        console.log("Error signing in:", error);
        setIsLoading(false);
      });

    // Reset form state
    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <>
      <div className="container">
        <div className="form-div">
          <form onSubmit={formSubmit}>
            <h5>Welcome back!</h5>
            <div className="div-email">
              <br />
              <label htmlFor="emailBox"> Email </label>
              <br />
              <input
                className="input-login"
                type="email"
                placeholder="Enter Your Email"
                id="emailBox"
                name="email"
                value={formData.email}
                required
                onChange={handleInputChange}
              />
            </div>

            <div className="div-password">
              <label htmlFor="passwordBox"> Password </label>
              <br />
              <input
                className="input-login"
                type={showPassword ? "text" : "password"} // Toggle between text and password
                placeholder="Enter Your password"
                id="passwordBox"
                name="password"
                value={formData.password}
                required
                onChange={handleInputChange}
              />
              <span
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <i class="fa-solid fa-eye"></i>
                ) : (
                  <i class="fa-solid fa-eye"></i>
                )}
              </span>
            </div>
            <br />
            <button className="button" type="submit">
              Login {isLoading && <i class="fas fa-spinner fa-pulse"></i>}
            </button>

            <div className="do-not-account">
              <p>or</p>
              <p>
                Don't have an account yet? <Link to="/register">Register</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
