import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaintBrushTool from "../components/paintbrushTool";
import { useTheme } from "../colorCustomiser";

function SetupPage() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [prepared, setPrepared] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: colors.bg }}>
      <PaintBrushTool />

      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <div className="rounded-2xl shadow-xl p-10 text-center w-full max-w-2xl min-h-[320px] flex flex-col space-y-8" style={{ backgroundColor: colors.box }}>
          <div className="w-full flex justify-start">
            <button onClick={() => navigate("/")} className="text-gray-600 hover:text-gray-800 transition text-2xl font-bold">←</button>
          </div>

          <h1 className="text-4xl font-bold drop-shadow" style={{ color: colors.title }}>Setup Page</h1>

          {!prepared ? (
            <button
              onClick={() => setPrepared(true)}
              className="px-8 py-4 rounded-xl shadow-md hover:opacity-90 transition font-medium"
              style={{ backgroundColor: colors.button, color: colors.text }}
            >
              PREPARE
            </button>
          ) : (
            <div className="flex flex-col items-center space-y-6">
              <p className="text-xl font-medium" style={{ color: colors.text }}>INDEX IS PREPARED</p>
              <button
                onClick={() => navigate("/index")}
                className="px-8 py-4 rounded-xl shadow-md hover:opacity-90 transition font-medium"
                style={{ backgroundColor: colors.button, color: colors.text }}
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
