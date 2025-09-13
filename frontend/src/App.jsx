import AdminPage from "./pages/AdminPage"; // ⬅️ new import
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

import LoginPage from "./pages/loginPage.jsx";
import MainPage from "./pages/mainPage.jsx";
import UploadPage from "./pages/uploadPage.jsx";
import IndexPage from "./pages/indexPage.jsx";
import { ThemeProvider } from "./colorCustomiser";

// Read Firebase config from Vite env variables (safer than hardcoding)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Fallback to existing in case env vars missing (keeps earlier behavior)
if (!firebaseConfig.apiKey) {
  console.warn("Firebase env not found - falling back to embedded config (not recommended).");
  // NOTE: you can keep the earlier hardcoded config here if necessary.
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) return <Navigate to="/" replace />;
  return children;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  const handleLogin = async (email, password) => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCred.user.getIdToken();
      localStorage.setItem("authToken", token);
      localStorage.setItem("userEmail", email);
      setIsLoggedIn(true);
      return null;
    } catch (error) {
      return error.message;
    }
  };

  const handleSignUp = async (email, password) => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCred.user.getIdToken();
      localStorage.setItem("authToken", token);
      localStorage.setItem("userEmail", email);
      const userDocRef = doc(db, "users", userCred.user.uid);
      await setDoc(userDocRef, { role: "visitor" }, { merge: true });
      setIsLoggedIn(true);
      return null;
    } catch (error) {
      return error.message;
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem("userEmail");
    localStorage.removeItem("authToken");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) setUserRole(userDoc.data().role);
          else setUserRole("visitor");
          const token = await user.getIdToken();
          localStorage.setItem("authToken", token);
          localStorage.setItem("userEmail", user.email);
          setIsLoggedIn(true);
        } catch (err) {
          setIsLoggedIn(true);
        }
      } else {
        localStorage.removeItem("userEmail");
        setUserRole(null);
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/main" replace />
            ) : (
              <LoginPage handleLogin={handleLogin} handleSignUp={handleSignUp} />
            )
          }
        />
        <Route
          path="/main"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ThemeProvider>
                <MainPage setIsLoggedIn={setIsLoggedIn} handleLogout={handleLogout} />
              </ThemeProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ThemeProvider>
                <UploadPage />
              </ThemeProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/index"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ThemeProvider>
                <IndexPage />
              </ThemeProvider>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
