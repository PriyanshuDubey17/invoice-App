import React from "react";
import "./Dashboard.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { auth } from "../../Firebase";
import { signOut } from "firebase/auth";

export default function Dashboard() {
  const Navigate = useNavigate();
  const logout = () => {
    signOut(auth)
      .then(() => {
        localStorage.clear();
        Navigate("/login");
        // Sign-out successful.
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div className="main-container">
        <div className="side-nav">
          <div className="profile-logo-company-name">
            <img src={localStorage.getItem("imageUrl")} alt="logo" />

            <div className="heading-h5">
              <span className="span">
                {localStorage.getItem("companyName")}{" "}
              </span>
            </div>
          </div>

          <div className="menu-div">
            <Link to="home" className="menu-link">
              <i
                className="fa-solid fa-house"
                style={{ paddingRight: "4px" }}
              ></i>
              Home{" "}
            </Link>
            <Link to="invoices" className="menu-link">
              <i
                className="fa-solid fa-file-invoice"
                style={{ paddingRight: "4px" }}
              ></i>
              Invoice
            </Link>
            <Link to="newInvoice" className="menu-link">
              <i
                className="fa-solid fa-file-circle-plus"
                style={{ paddingRight: "4px" }}
              ></i>
              New Invoice
            </Link>
            <Link to="setting" className="menu-link">
              <i
                className="fa-solid fa-cog"
                style={{ paddingRight: "4px" }}
              ></i>
              Setting
            </Link>
            <div className="div-logout">
              <button onClick={logout} className="logout-btn">
                {" "}
                <i
                  className="fa-solid fa-right-from-bracket"
                  style={{ paddingRight: "4px" }}
                ></i>
                Logout{" "}
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
