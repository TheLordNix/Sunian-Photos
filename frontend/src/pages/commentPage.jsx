import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CommentPage() {
  const navigate = useNavigate();

  // Dummy images (replace with real data later)
  const [images] = useState([
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/280",
    "https://via.placeholder.com/260",
  ]);

  // Store comments
  const [comments, setComments] = useState({});

  const handleCommentChange = (idx, value) => {
    setComments((prev) => ({ ...prev, [idx]: value }));
  };

  const handleCommentSubmit = (idx) => {
    if (comments[idx]) {
      alert(`Comment on image ${idx + 1}: ${comments[idx]}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[rgba(121,255,255,1)] relative">
      {/* Top-left paintbrush */}
      <button className="absolute top-4 left-4 bg-white p-4 rounded-full shadow-md hover:bg-gray-200 transition">
        🎨
      </button>

      {/* Center container */}
      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <div className="bg-[rgba(240,192,133,1)] rounded-2xl shadow-xl p-8 w-full max-w-5xl min-h-[480px]">
          {/* Back button */}
          <div className="w-full flex justify-start mb-4">
            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-800 transition text-2xl font-bold"
            >
              ←
            </button>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-center text-gray-800 drop-shadow mb-8">
            Comments Page
          </h1>

          {/* Image grid with comments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {images.map((src, idx) => (
              <div
                key={idx}
                className="bg-gray-50 p-4 rounded-xl shadow-md flex flex-col items-center"
              >
                <img
                  src={src}
                  alt={`Image ${idx + 1}`}
                  className="max-w-[280px] max-h-[280px] rounded-lg object-contain"
                />
                <textarea
                  value={comments[idx] || ""}
                  onChange={(e) => handleCommentChange(idx, e.target.value)}
                  placeholder="Write a comment..."
                  className="mt-4 w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <button
                  onClick={() => handleCommentSubmit(idx)}
                  className="mt-3 px-5 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
                >
                  Submit
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentPage;
