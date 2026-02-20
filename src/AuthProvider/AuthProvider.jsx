import React, { createContext, useEffect, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import app from '../Firebase/firebase.config'



export const AuthContext = createContext();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [dbUser, setDbUser] = useState(null);

  const userSignUp = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password)
  }
  const userLogin = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  }
  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider)
  }
  const logOut = () => {
    setLoading(true);
    return signOut(auth)
  }
  // Fetch role from DB
  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/users/${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          setDbUser(data);
          setLoading(false);
        });
    }
  }, [user]);
  const value = {
    user,
    dbUser,
    setUser,
    loading,
    setLoading,
    userSignUp,
    userLogin,
    googleLogin,
    logOut,
    auth
  }
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);
    });
    return ()=> unSubscribe();
  }, [])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;