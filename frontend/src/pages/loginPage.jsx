import { useState } from "react";

function LoginPage({ setIsLoggedIn }) {
  const [input, setInput] = useState("");

  const handleLogin = () => {
    if (input.trim() !== "") {
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgba(121,255,255,1)]">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Login</h1>
        <input
          type="text"
          placeholder="Enter anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border rounded px-4 py-2 w-full mb-4"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
