import { useNavigate } from "react-router-dom";
import PaintBrushTool from "../components/paintbrushTool";
import { useTheme } from "../colorCustomiser";

function MainPage({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const { colors } = useTheme();

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{ backgroundColor: colors.global?.bg }}
    >
      {/* ✅ PaintBrushTool configured for MainPage */}
      <PaintBrushTool currentPage="main" />

      <div
        className="rounded-2xl shadow-lg p-10 text-center w-full max-w-4xl min-h-[350px]"
        style={{ backgroundColor: colors.global?.box }}
      >
        <h1
          className="text-8xl font-bold mb-8"
          style={{ color: colors.global?.title }}
        >
          Sunian Photos
        </h1>

        <div className="border-t border-orange-400 pt-6 gap-4 mb-8 flex flex-wrap justify-center">
          <button
            style={{
              backgroundColor: colors.mainPage?.galleryBtn || "#3B82F6",
              color: colors.global?.text,
            }}
            className="text-xl px-12 py-6 rounded-lg"
            onClick={() => navigate("/index")}
          >
            GALLERY
          </button>
          <button
            style={{
              backgroundColor: colors.mainPage?.uploadBtn || "#3B82F6",
              color: colors.global?.text,
            }}
            className="text-xl px-12 py-6 rounded-lg"
            onClick={() => navigate("/upload")}
          >
            UPLOAD
          </button>
          <button
            style={{
              backgroundColor: colors.mainPage?.logoutBtn || "#3B82F6",
              color: colors.global?.text,
            }}
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
