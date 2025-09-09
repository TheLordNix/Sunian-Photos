import { useNavigate } from "react-router-dom";
import PaintBrushTool from "../components/paintbrushTool";
import { useTheme } from "../colorCustomiser";

function MainPage({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const { colors } = useTheme();

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{ backgroundColor: colors.bg }}
    >
      <PaintBrushTool />

      <div
        className="rounded-2xl shadow-lg p-10 text-center w-full max-w-4xl min-h-[480px]"
        style={{ backgroundColor: colors.box }}
      >
        <h1
          className="text-8xl font-bold mb-8"
          style={{ color: colors.title }}
        >
          Sunian Photos
        </h1>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {["SETUP", "UPLOAD", "COMMENTS", "EDIT"].map((label) => (
            <button
              key={label}
              style={{ backgroundColor: colors.button, color: colors.text }}
              className="text-xl px-9 py-6 rounded-lg"
              onClick={() => navigate("/" + label.toLowerCase())}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="border-t border-orange-400 pt-6 gap-4 mb-8 flex flex-wrap justify-center">
          <button
            style={{ backgroundColor: colors.button, color: colors.text }}
            className="text-xl px-12 py-6 rounded-lg"
            onClick={() => navigate("/index")}
          >
            INDEX
          </button>
          <button
            style={{ backgroundColor: colors.button, color: colors.text }}
            className="text-xl px-9 py-6 rounded-lg"
            onClick={() => setIsLoggedIn(false)}
          >
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
