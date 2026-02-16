import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../AuthProvider/AuthProvider";

const formatDateTime = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString(); // date + time
};

const Profile = () => {
  const { user } = useContext(AuthContext);
  const email = user?.email;
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!email) return;
    fetch(`http://localhost:5000/users/${email}`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [email]);
  const dbUser = data?.data;
  return (
    <div className="max-w-5xl mx-auto bg-white shadow rounded-lg p-6">
      {/* User Image */}
      <div className="flex justify-center">
        <img
          src={dbUser?.photoURL || user?.photoURL}
          alt="User"
          className="w-24 h-24 rounded-full border border-primary"
        />
      </div>

      {/* User Info */}
      <div className="text-center mt-4 space-y-1">
        <h2 className="text-xl font-bold">{dbUser?.name}</h2>
        <p className="text-gray-600">{dbUser?.email}</p>

        <span className="inline-block px-3 py-1 text-sm rounded-full bg-primary/10 text-primary mt-2 font-bold capitalize">
          {dbUser?.role}
        </span>
      </div>

      {/* Meta Info */}
      <div className="mt-6 space-y-2 text-sm">
        <div className="flex justify-between gap-1">
          <span className="font-bold">Created At:</span>
          <span>{formatDateTime(dbUser?.createdAt)}</span>
        </div>

        <div className="flex justify-between gap-1">
          <span className="font-bold">Last Login:</span>
          <span>{formatDateTime(dbUser?.lastLoginAt)}</span>
        </div>

        <div className="flex justify-between gap-1">
          <span className="font-bold">Role Updated:</span>
          <span>{formatDateTime(dbUser?.roleUpdatedAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
