import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SetupPage() {
  const navigate = useNavigate();
  const [prepared, setPrepared] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[rgba(121,255,255,1)] relative">
      {/* Top-left paintbrush */}
      <button className="absolute top-4 left-4 bg-white p-4 rounded-full shadow-md hover:bg-gray-200 transition">
        🎨
      </button>

      {/* Center container */}
      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <div className="bg-[rgba(240,192,133,1)] rounded-2xl shadow-xl p-10 text-center w-full max-w-2xl min-h-[320px] flex flex-col space-y-8">
          {/* Back button */}
          <div className="w-full flex justify-start">
            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-800 transition text-2xl font-bold"
            >
              ←
            </button>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-800 drop-shadow">
            Setup Page
          </h1>

          {!prepared ? (
            <button
              onClick={() => setPrepared(true)}
              className="px-8 py-4 bg-blue-500 text-white text-lg rounded-xl shadow-md hover:bg-blue-600 transition"
            >
              PREPARE
            </button>
          ) : (
            <div className="flex flex-col items-center space-y-6">
              <p className="text-xl font-medium text-gray-700">
                INDEX IS PREPARED
              </p>
              <button
                onClick={() => navigate("/index")}
                className="px-8 py-4 bg-green-500 text-white text-lg rounded-xl shadow-md hover:bg-green-600 transition"
              >
                GO TO INDEX
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SetupPage;
