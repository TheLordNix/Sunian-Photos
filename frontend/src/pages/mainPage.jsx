import { useNavigate } from "react-router-dom";

function MainPage({ setIsLoggedIn }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cyan-500 flex items-center justify-center relative">
      {/* Top-right paintbrush */}
      <button className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-md hover:bg-gray-200">
        🎨
      </button>

      {/* Center box */}
      <div className="bg-amber-200 rounded-2xl shadow-lg p-10 text-center w-full max-w-2xl">
        <h1 className="text-5xl font-bold text-[rgb(215,115,0)] mb-8">
          Sunian Photos
        </h1>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg" onClick={() => navigate("/setup")}>SETUP</button>
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg" onClick={() => navigate("/upload")}>UPLOAD</button>
          <button className="bg-purple-500 text-white px-6 py-3 rounded-lg" onClick={() => navigate("/edit")}>EDIT</button>
          <button className="bg-red-500 text-white px-6 py-3 rounded-lg" onClick={() => setIsLoggedIn(false)}>LOGOUT</button>
        </div>

        <div className="border-t border-orange-400 pt-6">
          <button className="bg-gray-700 text-white px-8 py-3 rounded-lg" onClick={() => navigate("/index")}>INDEX</button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
