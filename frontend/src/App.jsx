import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import LoginPage from "./pages/loginPage";
import MainPage from "./pages/mainPage";
import SetupPage from "./pages/setupPage";
import UploadPage from "./pages/uploadPage";
import EditPage from "./pages/editPage";
import IndexPage from "./pages/indexPage";

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
              <MainPage setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <LoginPage setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />

        {/* Only show these if logged in */}
        {isLoggedIn && (
          <>
            <Route path="/setup" element={<SetupPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/edit" element={<EditPage />} />
            <Route path="/index" element={<IndexPage />} />
          </>
        )}

        {/* Anything else → go home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
