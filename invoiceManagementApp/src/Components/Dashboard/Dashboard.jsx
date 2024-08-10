import React, { useState } from "react";
import "./Dashboard.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { auth } from "../../Firebase";
import { signOut } from "firebase/auth";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    signOut(auth)
      .then(() => {
        localStorage.clear();
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLinkClick = () => {
    // Close sidebar when a link is clicked
    setIsSidebarOpen(false);
  };

  return (
    <>
      <div className="main-container">
        <button className="menu-icon" onClick={toggleSidebar}>
          <i className="fa-solid fa-bars"></i>
        </button>

        <div className={`side-nav ${isSidebarOpen ? "open" : ""}`}>
          <div className="profile-logo-company-name">
            <img src={localStorage.getItem("imageUrl")} alt="logo" />
            <div className="heading-h5">
              <span className="span">
                {localStorage.getItem("companyName")}
              </span>
            </div>
          </div>

          <div className="menu-div">
            <Link to="home" className="menu-link" onClick={handleLinkClick}>
              <i className="fa-solid fa-house" style={{ paddingRight: "4px" }}></i>
              Home
            </Link>
            <Link to="invoices" className="menu-link" onClick={handleLinkClick}>
              <i className="fa-solid fa-file-invoice" style={{ paddingRight: "4px" }}></i>
              Invoice
            </Link>
            <Link to="newInvoice" className="menu-link" onClick={handleLinkClick}>
              <i className="fa-solid fa-file-circle-plus" style={{ paddingRight: "4px" }}></i>
              New Invoice
            </Link>
            <Link to="setting" className="menu-link" onClick={handleLinkClick}>
              <i className="fa-solid fa-cog" style={{ paddingRight: "4px" }}></i>
              Setting
            </Link>
            <div className="div-logout">
              <button onClick={logout} className="logout-btn">
                <i className="fa-solid fa-right-from-bracket" style={{ paddingRight: "4px" }}></i>
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </>
  );
}
