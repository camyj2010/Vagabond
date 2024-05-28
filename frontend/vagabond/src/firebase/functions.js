import { auth } from "./firebase.config";
import { createUserWithEmailAndPassword } from "firebase/auth";

const createUser = (email, password)=> createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
		console.log(user)
		return user
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
		console.log(errorCode, errorMessage)
		return error.code
    // ..
  });

export {
	createUser
}