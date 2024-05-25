import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { createContext, useContext } from "react";

export const authContext = createContext();

export const useAuth = ()=> {
  const context = useContext(authContext);
  if(!context){
    console.error("Error creating auth context");
  }
  return context;
};

export function AuthProvider ({children}) {
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
    value={{login, loginWithGoogle, logout}}
  >
    {children}
  </authContext.Provider>;
}