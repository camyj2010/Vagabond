import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import React, { createContext, useContext, useState, useEffect } from "react";

export const authContext = createContext();

export const useAuth = ()=> {
  const context = useContext(authContext);
  if(!context){
    console.error("Error creating auth context");
  }
  return context;
};

export function AuthProvider ({children}) {
  const [user, setUser] = useState("");
  useEffect(()=>{
    const suscribed = onAuthStateChanged(auth, (currentUser)=>{
      if(!currentUser) {
        console.log("No suscribed user");
        setUser("");
      }else{
        setUser(currentUser);
      }
    });
    return () => suscribed()
  },[]);

  const login = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      return response;
    } catch (error) {
      console.error("Error during login:", error);
      throw error; 
    }
  };

  const loginWithGoogle = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      const response = await signInWithPopup(auth, googleProvider);
      return response;
    } catch (error) {
      console.error("Error during Google login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during logout:", error);
      throw error; 
    }
  };

  return <authContext.Provider
    value={{login, loginWithGoogle, logout, user}}
  >
    {children}
  </authContext.Provider>;
}