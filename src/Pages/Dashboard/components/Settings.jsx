import React, { useContext, useState } from "react";
import EditDoctor from "../../Doctor/EditDoctor";
import { AuthContext } from "../../../AuthProvider/AuthProvider";

const Settings = () => {
  const { dbUser } = useContext(AuthContext);
  const role = dbUser?.data?.role;

  const [showEdit, setShowEdit] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  const handleToggle = () => {
    setShowEdit(!showEdit);
  };
  const handleProfileToggle = () => {
    setShowProfileEdit(!showProfileEdit);
  };

  return (
    <div>
      {role === "doctor" && (
        <div className="">
          <button
            onClick={handleProfileToggle}
            className="btn btn-info mb-4 mx-auto text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]"
          >
            {showProfileEdit
              ? "Hide Edit Profile"
              : "Edit Your Profile"}
          </button>
          <br />
          <button
            onClick={handleToggle}
            className="btn btn-info mb-4 mx-auto text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]"
          >
            {showEdit ? "Hide Edit Doctor Profile" : "Edit Doctor Profile"}
          </button>

          {showEdit && <EditDoctor />}
        </div>
      )}
    </div>
  );
};

export default Settings;
