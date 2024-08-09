import React, { useState } from "react";
import "./Setting.css";
import { Storage, auth, db } from "../../../Firebase";
import { ref, uploadBytesResumable } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";

const Setting = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(localStorage.getItem("imageUrl"));
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [companyName, setCompanyName] = useState(
    localStorage.getItem("companyName")
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingC, setIsLoadingC] = useState(false);
  const [isLoadingE, setIsLoadingE] = useState(false);




  const onSelectFile = (e) => {
    setFile(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  const updateLogo = () => {
    setIsLoading(true);
    const fileRef = ref(Storage, localStorage.getItem("imageUrl"));
    console.log(fileRef._location.path_);
    const storageRef = ref(Storage, fileRef._location.path_);
    uploadBytesResumable(storageRef, file).then((res) => {
      setIsLoading(false);
      window.location.reload();
    });
    console.log("Updated");
    alert("imageUrl updated please wait...");
    
  };

  const updateCname = () => {
    setIsLoadingC(true);
    updateProfile(auth.currentUser, {
      displayName: companyName,
    }).then((res) => {
      localStorage.setItem("companyName", companyName);

      updateDoc(doc(db, "users", localStorage.getItem("uid")), {
        companyName: companyName,
      }).then((res) => {
        setIsLoadingC(false);
        window.location.reload();
      });
    });
    alert("Company Name updated successfully");
  };

  const updateEmail = () => {
    setIsLoadingE(true);
    updateProfile(auth.currentUser, {
      email: email,
    }).then((res) => {
      localStorage.setItem("email", email);

      updateDoc(doc(db, "users", localStorage.getItem("uid")), {
        email: email,
      }).then((res) => {
        setIsLoadingE(false);
        window.location.reload();
      });
    });
    alert("Company Email updated successfully");
  };

  return (
    <>
      <div>
        <div className="setting-wrapper">
          <div className="profile-info">
            <img src={imageUrl} alt="profile-pic" className="profile" />
            <input
              type="file"
              onChange={(e) => {
                onSelectFile(e);
              }}
            />
            {file && (
              <button
                className="btn-update"
                onClick={() => {
                  updateLogo();
                }}
              >
                Update Pic {isLoading && <i class="fas fa-spinner fa-pulse"></i>}
              </button>
            )}
            <input
              type="text"
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
              }}
              className="update-email-password"
            />

            <button className="btn-update" onClick={updateCname}>
              Update Name {isLoadingC &&  <i class="fas fa-spinner fa-pulse"></i>}
            </button>

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="update-email-password"
            />

            <button className="btn-update" onClick={updateEmail}>
              Update Email {isLoadingE && <i class="fas fa-spinner fa-pulse"></i>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
