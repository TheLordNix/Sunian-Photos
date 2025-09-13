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
import MainPage from "./pages/mainPage";
import UploadPage from "./pages/uploadPage";
import IndexPage from "./pages/indexPage";
import { ThemeProvider } from "./colorCustomiser";

// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7JQVSI1AlXuLD_k1FwPAkeic3E7kq9Yk",
  authDomain: "sunianphotos.firebaseapp.com",
  projectId: "sunianphotos",
  storageBucket: "sunianphotos.appspot.com",
  messagingSenderId: "71111238514",
  appId: "1:71111238514:web:566a5c01642fa7241a33eb",
  measurementId: "G-EEQ1KPN2VK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔒 ProtectedRoute ensures only logged-in users can access certain pages
function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  // --- Authentication Functions ---
  const handleLogin = async (email, password) => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Login successful:", userCred.user);
      return null;
    } catch (error) {
      console.error("❌ Login failed:", error.code, error.message);
      return error.message;
    }
  };

  const handleSignUp = async (email, password) => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      console.log("✅ Signup successful:", userCred.user);

      // ✅ Save user in Firestore if not exists
      const userDocRef = doc(db, "users", userCred.user.uid);
      await setDoc(userDocRef, { role: "visitor" }, { merge: true });

      return null;
    } catch (error) {
      console.error("❌ Signup failed:", error.code, error.message);
      return error.message;
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setUserRole(null);
  };

  // --- Auth State Observer ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role);
          } else {
            setUserRole("visitor");
          }
          setIsLoggedIn(true);
        } catch (err) {
          console.error("Error fetching user role:", err);
          setIsLoggedIn(true);
        }
      } else {
        setUserRole(null);
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public route (Login) */}
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

        {/* Protected pages */}
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
