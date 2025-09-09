import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PaintBrushTool from "../components/paintbrushTool";
import { useTheme } from "../colorCustomiser";

function IndexPage() {
  const navigate = useNavigate();
  const { colors } = useTheme();

  const [images, setImages] = useState([
    { src: "https://via.placeholder.com/300x200", size: 200, thumb: 100 },
    { src: "https://via.placeholder.com/250x250", size: 200, thumb: 100 },
    { src: "https://via.placeholder.com/280x180", size: 200, thumb: 100 },
  ]);

  const [originalImages] = useState(images);
  const [isEditing, setIsEditing] = useState(false);

  const moveImage = (idx, direction) => {
    const newImages = [...images];
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= newImages.length) return;
    [newImages[idx], newImages[swapIdx]] = [newImages[swapIdx], newImages[idx]];
    setImages(newImages);
  };

  const resizeImage = (idx, size) => {
    const newImages = [...images];
    newImages[idx].size = size;
    setImages(newImages);
  };

  const resizeThumb = (idx, size) => {
    const newImages = [...images];
    newImages[idx].thumb = size;
    setImages(newImages);
  };

  const deleteImage = (idx) => setImages(images.filter((_, i) => i !== idx));
  const clearAll = () => setImages([]);
  const reset = () => setImages(originalImages);
  const save = () => {
    setIsEditing(false);
    alert("Changes saved!");
  };

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: colors.bg }}>
      <PaintBrushTool />

      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <div className="rounded-2xl shadow-xl p-8 w-full max-w-6xl min-h-[480px] relative" style={{ backgroundColor: colors.box }}>
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => navigate("/")} className="text-gray-600 hover:text-gray-800 transition text-2xl font-bold">
              ←
            </button>
            <button onClick={() => setIsEditing((prev) => !prev)} className="text-gray-600 hover:text-gray-800 transition text-lg font-semibold">
              {isEditing ? "✔ Done" : "✎ Edit"}
            </button>
          </div>

          <h1 className="text-4xl font-bold text-center mb-8" style={{ color: colors.title }}>
            Index Page
          </h1>

          {images.length > 0 ? (
            <div className={`grid ${isEditing ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"} gap-8`}>
              {images.map((img, idx) => (
                <div key={idx} className="p-4 rounded-xl shadow-md flex flex-col items-center" style={{ backgroundColor: colors.imageBox }}>
                  <img src={img.src} alt={`Image ${idx + 1}`} style={{ width: img.size, height: "auto" }} className="rounded-lg object-contain" />

                  {isEditing && (
                    <>
                      <div className="mt-4 w-full">
                        <label className="text-sm text-gray-600">Image Size ({img.size}px)</label>
                        <input type="range" min="100" max="400" value={img.size} onChange={(e) => resizeImage(idx, parseInt(e.target.value))} className="w-full" />
                      </div>
                      <div className="mt-2 w-full">
                        <label className="text-sm text-gray-600">Thumbnail Size ({img.thumb}px)</label>
                        <input type="range" min="50" max="200" value={img.thumb} onChange={(e) => resizeThumb(idx, parseInt(e.target.value))} className="w-full" />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => moveImage(idx, -1)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">↑</button>
                        <button onClick={() => moveImage(idx, 1)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">↓</button>
                        <button onClick={() => deleteImage(idx)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center">No images prepared yet. Go to Setup Page to prepare index.</p>
          )}

          {isEditing && (
            <div className="flex justify-between mt-8">
              <button onClick={clearAll} className="px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600">Clear All</button>
              <div className="flex gap-4">
                <button onClick={reset} className="px-6 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600">Reset</button>
                <button onClick={save} className="px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600">Save</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default IndexPage;
