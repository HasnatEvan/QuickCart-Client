import { createContext, useEffect, useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  getAuth, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  sendEmailVerification, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  updateProfile 
} from "firebase/auth";
import { app } from "../Firebase/firebase.config";
import axios from "axios";

import PropTypes from "prop-types";

export const AuthContext = createContext(null);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProviders = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ **Create User & Send Verification Email**
  const createUser = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      return userCredential;
    } finally {
      setLoading(false);
    }
  };

  // ✅ **Login User**
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        throw new Error("Please verify your email before logging in.");
      }
      return userCredential;
    } finally {
      setLoading(false);
    }
  };

  // ✅ **Google Login**
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } finally {
      setLoading(false);
    }
  };

  // ✅ **Log Out**
  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      await axios.get("http://localhost:5000/logout", { withCredentials: true });
    } finally {
      setLoading(false);
    }
  };

  // ✅ **Update Profile**
  const updateUserProfile = async (name, photo) => {
    if (!auth.currentUser) return;
    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo,
      });
      setUser({ ...auth.currentUser, displayName: name, photoURL: photo });
    } finally {
      // No need for an explicit catch block if not handling the error in this context
    }
  };

  // ✅ **Check User Authentication State**
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser?.emailVerified) {
        setUser(currentUser);
        try {
          await axios.post("http://localhost:5000/jwt", { email: currentUser.email }, { withCredentials: true });
        } catch (error) {
          console.error("JWT token error:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 **Authentication Context Data**
  const userInfo = {
    user,
    loading,
    createUser,
    signIn,
    signInWithGoogle,
    logOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={userInfo}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProviders.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProviders;
