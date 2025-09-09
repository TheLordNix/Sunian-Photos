import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaintBrushTool from "../components/paintbrushTool";
import { useTheme } from "../colorCustomiser";

function EditPage() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [images, setImages] = useState([
    "https://via.placeholder.com/200x150",
    "https://via.placeholder.com/180x180",
    "https://via.placeholder.com/220x160",
  ]);
  const [imageSize, setImageSize] = useState(200);
  const [thumbSize, setThumbSize] = useState(80);

  const moveImage = (index, direction) => {
    const newImages = [...images];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    setImages(newImages);
  };

  const deleteImage = (index) => setImages(images.filter((_, i) => i !== index));
  const clearAll = () => setImages([]);

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: colors.bg }}>
      <PaintBrushTool />

      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <div className="rounded-2xl shadow-xl p-8 w-full max-w-5xl min-h-[480px]" style={{ backgroundColor: colors.box }}>
          <div className="w-full flex justify-start mb-4">
            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-800 transition text-2xl font-bold"
            >
              ←
            </button>
          </div>

          <h1 className="text-4xl font-bold text-center drop-shadow mb-6" style={{ color: colors.title }}>
            Edit Page
          </h1>

          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex flex-col items-center">
              <label className="mb-2 font-medium" style={{ color: colors.text }}>Image Size</label>
              <input
                type="range"
                min="100"
                max="400"
                value={imageSize}
                onChange={(e) => setImageSize(Number(e.target.value))}
                className="w-40"
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="mb-2 font-medium" style={{ color: colors.text }}>Thumbnail Size</label>
              <input
                type="range"
                min="40"
                max="150"
                value={thumbSize}
                onChange={(e) => setThumbSize(Number(e.target.value))}
                className="w-40"
              />
            </div>
            <button
              onClick={clearAll}
              className="px-6 py-3 rounded-xl shadow-md hover:opacity-90 transition font-medium"
              style={{ backgroundColor: colors.button, color: colors.text }}
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {images.map((src, idx) => (
              <div key={idx} className="p-4 rounded-xl shadow-md flex flex-col items-center" style={{ backgroundColor: colors.imageBox }}>
                <img src={src} alt={`Image ${idx}`} style={{ width: `${imageSize}px`, height: "auto" }} className="object-contain rounded-lg" />
                <div className="flex gap-2 mt-3">
                  <button onClick={() => moveImage(idx, -1)} className="px-3 py-1 rounded-lg hover:opacity-80 transition" style={{ backgroundColor: colors.button, color: colors.text }}>↑</button>
                  <button onClick={() => moveImage(idx, 1)} className="px-3 py-1 rounded-lg hover:opacity-80 transition" style={{ backgroundColor: colors.button, color: colors.text }}>↓</button>
                  <button onClick={() => deleteImage(idx)} className="px-3 py-1 rounded-lg hover:opacity-80 transition" style={{ backgroundColor: "red", color: "white" }}>✕</button>
                </div>
                <div className="mt-3">
                  <img src={src} alt="thumb" style={{ width: `${thumbSize}px`, height: "auto" }} className="object-contain rounded-md border border-gray-300" />
                </div>
              </div>
            ))}
            {images.length === 0 && <p className="text-gray-600 col-span-full text-center">No images available.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPage;
