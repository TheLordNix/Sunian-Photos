import React, { useState } from "react";

const loginPageStyles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Arial, sans-serif',
  },
  formBox: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  // Add other style objects here
};

const LoginPage = ({ handleLogin, handleSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const loginError = await handleLogin(email, password);
    if (loginError) {
      setError(loginError);
    }
  };

  const onSignUpClick = async () => {
    setError("");
    const signUpError = await handleSignUp(email, password);
    if (signUpError) {
      setError(signUpError);
    }
  };

  return (
    <div style={loginPageStyles.container}>
      <div style={loginPageStyles.formBox}>
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={onLoginSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
              required
            />
          </div>
          {/* Add other styled elements */}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;