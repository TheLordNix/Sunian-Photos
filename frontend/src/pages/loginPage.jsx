import { useState } from "react";

function LoginPage({ handleLogin, handleSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onLoginClick = async () => {
    setError("");
    const loginError = await handleLogin(email, password);
    if (loginError) {
      setError(loginError);
    } else {
      console.log("Login successful!");
    }
  };

  const onSignUpClick = async () => {
    setError("");
    const signUpError = await handleSignUp(email, password);
    if (signUpError) {
      setError(signUpError);
    } else {
      console.log("Signup successful!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyan-500">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6">Login</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="space-y-4">
          {/* Email */}
          <div className="text-left">
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Password */}
          <div className="text-left">
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 mt-6">
            <button
              type="button"
              onClick={onLoginClick}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Login
            </button>
            <button
              type="button"
              onClick={onSignUpClick}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
