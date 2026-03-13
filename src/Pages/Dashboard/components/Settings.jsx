import React, { useContext } from "react";
import EditDoctor from "../../Doctor/EditDoctor";
import { AuthContext } from "../../../AuthProvider/AuthProvider";
import UpdateUserProfile from "./UpdateUserProfile";

const Settings = () => {
  const { dbUser } = useContext(AuthContext);
  const role = dbUser?.data?.role;

  return (
    <div>
      <UpdateUserProfile />
      {role === "doctor" && <EditDoctor />}
    </div>
  );
};

export default Settings;
