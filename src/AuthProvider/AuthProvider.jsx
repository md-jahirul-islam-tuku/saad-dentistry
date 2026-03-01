import React, { createContext, useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import app from "../Firebase/firebase.config";

export const AuthContext = createContext();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbUser, setDbUser] = useState(null);

  const userSignUp = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const userLogin = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    localStorage.removeItem("accessToken");
    await signOut(auth);
    setUser(null);
    setDbUser(null);
    setLoading(false);
  };

  // 🔹 Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser || null);

      if (currentUser?.email) {
        try {
          // ✅ Get JWT
          const tokenRes = await fetch(
            "https://saad-dentistry-server.vercel.app/jwt",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: currentUser.email }),
            }
          );
          const { token } = await tokenRes.json();
          localStorage.setItem("accessToken", token);

          // ✅ Fetch user data
          const userRes = await fetch(
            `https://saad-dentistry-server.vercel.app/users/${currentUser.email}`,
            { headers: { authorization: `Bearer ${token}` } }
          );
          const userData = await userRes.json();
          setDbUser(userData);
        } catch (err) {
          console.error("AuthProvider Error:", err);
          setDbUser(null);
        }
      } else {
        localStorage.removeItem("accessToken");
        setDbUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, dbUser, loading, userSignUp, userLogin, googleLogin, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;