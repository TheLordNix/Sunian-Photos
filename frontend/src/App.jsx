import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import LoginPage from "./pages/loginPage";
import MainPage from "./pages/mainPage";
import SetupPage from "./pages/setupPage";
import UploadPage from "./pages/uploadPage";
import EditPage from "./pages/editPage";
import IndexPage from "./pages/indexPage";
import CommentPage from "./pages/commentPage";
import { ThemeProvider } from "./colorCustomiser";

// ProtectedRoute component ensures only logged-in users can access certain pages
function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Login page */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <ThemeProvider>
                <MainPage setIsLoggedIn={setIsLoggedIn} />
              </ThemeProvider>
            ) : (
              <LoginPage setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />

        {/* Protected pages */}
        <Route
          path="/setup"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ThemeProvider>
                <SetupPage />
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
          path="/edit"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ThemeProvider>
                <EditPage />
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
        <Route
          path="/comment"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ThemeProvider>
                <CommentPage />
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
