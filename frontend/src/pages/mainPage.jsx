import { useNavigate } from "react-router-dom";

function MainPage({ setIsLoggedIn }) {
  const navigate = useNavigate();

  return (
        <div className="min-h-screen bg-[rgba(121,255,255,1)] flex items-center justify-center relative">
            {/* Top-right paintbrush */}
        <button className="absolute top-4 left-4 bg-white p-4 rounded-full shadow-md hover:bg-gray-200 transition">
            🎨
        </button>

            {/* Center box */}
            <div className="bg-[rgba(240,192,133,1)] rounded-2xl shadow-lg p-10 text-center w-full max-w-4xl min-h-[480px]">
                <h1 className="text-8xl font-bold text-[rgba(255,102,0,1)] mb-8">
                    Sunian Photos
                </h1>

            {/* Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
                <button className="bg-blue-500 text-white text-xl px-9 py-6 rounded-lg" onClick={() => navigate("/setup")}>SETUP</button>
                <button className="bg-blue-500 text-white text-xl px-12 py-6 rounded-lg" onClick={() => navigate("/upload")}>UPLOAD</button>
                <button className="bg-blue-500 text-white text-xl px-12 py-6 rounded-lg" onClick={() => navigate("/comment")}>COMMENTS</button>
                <button className="bg-blue-500 text-white text-xl px-9 py-6 rounded-lg" onClick={() => navigate("/edit")}>EDIT</button>
            </div>

            <div className="border-t border-orange-400 pt-6 gap-4 mb-8 flex flex-wrap justify-center">
                <button className="bg-blue-900 text-white text-xl px-12 py-6 rounded-lg" onClick={() => navigate("/index")}>INDEX</button>
                <button className="bg-red-500 text-white text-xl px-9 py-6 rounded-lg" onClick={() => setIsLoggedIn(false)}>LOGOUT</button>
            </div>
        </div>
    </div>
  );
}

export default MainPage;
