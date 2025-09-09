import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaintBrushTool from "../components/paintbrushTool";
import { useTheme } from "../colorCustomiser";

function CommentPage() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [images] = useState([
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/280",
    "https://via.placeholder.com/260",
  ]);
  const [comments, setComments] = useState({});

  const handleCommentChange = (idx, value) => setComments((prev) => ({ ...prev, [idx]: value }));
  const handleCommentSubmit = (idx) => { if (comments[idx]) alert(`Comment on image ${idx + 1}: ${comments[idx]}`); };

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: colors.bg }}>
      <PaintBrushTool />

      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <div className="rounded-2xl shadow-xl p-8 w-full max-w-5xl min-h-[480px]" style={{ backgroundColor: colors.box }}>
          <div className="w-full flex justify-start mb-4">
            <button onClick={() => navigate("/")} className="text-gray-600 hover:text-gray-800 transition text-2xl font-bold">←</button>
          </div>

          <h1 className="text-4xl font-bold text-center drop-shadow mb-8" style={{ color: colors.title }}>Comments Page</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {images.map((src, idx) => (
              <div key={idx} className="p-4 rounded-xl shadow-md flex flex-col items-center" style={{ backgroundColor: colors.imageBox }}>
                <img src={src} alt={`Image ${idx}`} className="max-w-[280px] max-h-[280px] rounded-lg object-contain" />
                <textarea
                  value={comments[idx] || ""}
                  onChange={(e) => handleCommentChange(idx, e.target.value)}
                  placeholder="Write a comment..."
                  className="mt-4 w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-400 outline-none"
                  style={{ color: colors.text, backgroundColor: colors.bg }}
                />
                <button
                  onClick={() => handleCommentSubmit(idx)}
                  className="mt-3 px-5 py-2 rounded-lg shadow-md hover:opacity-90 transition font-medium"
                  style={{ backgroundColor: colors.button, color: colors.text }}
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
