import React, { createContext, useEffect, useState } from 'react';
import getAuth, { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import app from '../Firebase/firebase.config'



const AuthContext = createContext();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const userRegister = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password)
  }
  const userLogin = (email, password)=>{
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  }
  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider)
  }
  const logOut = () =>{
    setLoading(true);
    return signOut(auth)
  }
  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return ()=> unsubscribe();
  },[])

  const value = {
    user,
    setUser,
    loading,
    setLoading,
    userRegister,
    userLogin,
    googleLogin,
    logOut
  }
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;