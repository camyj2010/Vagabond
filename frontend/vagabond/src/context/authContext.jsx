import { signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
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

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during logout:", error);
      throw error; 
    }
  };

  const updateProfileData = async (profileData) => {
    if(!user) {
      throw new Error("No user is currently logged in");
    }
    try {
      await updateProfile(user, profileData);
      setUser({ ...user, ...profileData });
    } catch (error) {
      console.error("Error updating profile:",error);
      throw error;
    }
  };

  return <authContext.Provider
    value={{login, logout, user, updateProfileData}}
  >
    {children}
  </authContext.Provider>;
}