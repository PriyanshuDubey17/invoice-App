import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { auth, Storage, db } from "../../Firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    companyName: "",
    companyLogo: null,
  });

  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const [isLoading, setIsLoading] = useState(false);
  const Navigate = useNavigate();

  // Function for handleChangeInput state here
  const handleInputChange = (event) => {
    console.log("handleInput");
    setFormData((currentData) => {
      return { ...currentData, [event.target.name]: event.target.value };
    });
  };
  // Function for handleChangeInput end here

  // Function to handle file input changes
  const handleFileChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      companyLogo: event.target.files[0], // Assuming single file selection
    }));
  };

  // Function for formSubmit state here
  let formSubmit = (event) => {
    setIsLoading(true);
    event.preventDefault();

    createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then((newUser) => {
        // Signed up
       
        console.log(newUser);

        const date = new Date().getTime();
        const storageRef = ref(Storage, `${formData.companyName}_${date}`);

        uploadBytesResumable(storageRef, formData.companyLogo).then((res) => {
          console.log("Upload Success", res);

          getDownloadURL(storageRef).then((downloadURL) => {
            console.log("File URL:", downloadURL);
            // ...

            updateProfile(newUser.user, {
              displayName: formData.companyName,
              photoURL: downloadURL,
            });

            setDoc(doc(db, "users", newUser.user.uid), {
              uid: newUser.user.uid,
              email: formData.email,
              companyName: formData.companyName,
              companyLogo: downloadURL,

              //... other user data
            });
            Navigate("/dashboard"); // Navigate to dashboard after successful login
            setIsLoading(false);
            localStorage.setItem("companyName", formData.companyName);
            localStorage.setItem("imageUrl", downloadURL);
            localStorage.setItem("email", newUser.user.email);
            localStorage.setItem("uid", newUser.user.uid);
          });
        });

        // ...
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        // ..
      });

    console.log("FormSubmit");
    setFormData({
      email: "",
      password: "",
      companyName: "",
      companyLogo: null,
    });
  }; // Function for formSubmit end here

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="container">
        <div className="form-div-region">
          <form onSubmit={formSubmit}>
            <h5>Create new account</h5>
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

            <div className="companyName">
              <br />
              <label htmlFor="companyName"> Company Name </label>
              <br />
              <input
                className="input-login"
                type="text"
                placeholder="Enter Your Company Name"
                id="companyName"
                name="companyName"
                value={formData.companyName}
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
                className="password-toggle-register"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <i class="fa-solid fa-eye"></i>
                ) : (
                  <i class="fa-solid fa-eye"></i>
                )}
              </span>
            </div>

            <div className="companyLogo">
              <br />
              <label htmlFor="companyLogo"> Company Logo </label>
              <br />
              <input
                className="input-login"
                type="file"
                id="companyLogo"
                name="companyLogo"
                // value={formData.companyLogo}
                // required
                onChange={handleFileChange}
              />
            </div>
            <button className="button" type="submit">
              Register {isLoading && <i class="fas fa-spinner fa-pulse"></i>}
            </button>

            <div className="do-not-account">
              <span>or</span>
              <p>
                Already have account? <Link to="/login">Login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
