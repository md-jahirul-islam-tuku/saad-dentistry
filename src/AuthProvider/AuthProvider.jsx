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
  const [user, setUser] = useState(null); // ✅ FIXED
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
    } catch (error) {
      throw error;
    } finally {
      setLoading(false); // ✅ VERY IMPORTANT
    }
  };

  const googleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unSubscribe();
  }, []);
  useEffect(() => {
    if (user?.email) {
      fetch(`https://saad-dentistry-server.vercel.app/users/${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          setDbUser(data);
          setLoading(false);
        });
    }
  }, [user]);

  useEffect(() => {
    if (user?.email) {
      fetch("https://saad-dentistry-server.vercel.app/jwt", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email: user.email }),
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("accessToken", data.token);
        });
    }
  }, [user]);

  const value = {
    user,
    dbUser,
    loading,
    userSignUp,
    userLogin,
    googleLogin,
    logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
