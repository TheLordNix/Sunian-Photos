import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EditPage() {
  const navigate = useNavigate();

  // Dummy images for now (replace with uploaded ones later)
  const [images, setImages] = useState([
    "https://via.placeholder.com/200x150",
    "https://via.placeholder.com/180x180",
    "https://via.placeholder.com/220x160",
  ]);

  const [imageSize, setImageSize] = useState(200); // default size
  const [thumbSize, setThumbSize] = useState(80); // thumbnail size

  // Move image up/down
  const moveImage = (index, direction) => {
    const newImages = [...images];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    [newImages[index], newImages[targetIndex]] = [
      newImages[targetIndex],
      newImages[index],
    ];
    setImages(newImages);
  };

  // Delete image
  const deleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Clear all
  const clearAll = () => {
    setImages([]);
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
          <h1 className="text-4xl font-bold text-center text-gray-800 drop-shadow mb-6">
            Edit Page
          </h1>

          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex flex-col items-center">
              <label className="mb-2 font-medium text-gray-700">Image Size</label>
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
              <label className="mb-2 font-medium text-gray-700">
                Thumbnail Size
              </label>
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
              className="px-6 py-3 bg-red-500 text-white rounded-xl shadow-md hover:bg-red-600 transition font-medium"
            >
              Clear All
            </button>
          </div>

          {/* Images List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {images.map((src, idx) => (
              <div
                key={idx}
                className="bg-gray-50 p-4 rounded-xl shadow-md flex flex-col items-center"
              >
                <img
                  src={src}
                  alt={`Image ${idx + 1}`}
                  style={{ width: `${imageSize}px`, height: "auto" }}
                  className="object-contain rounded-lg"
                />

                {/* Controls for each image */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => moveImage(idx, -1)}
                    className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveImage(idx, 1)}
                    className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => deleteImage(idx)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>

                {/* Thumbnail Preview */}
                <div className="mt-3">
                  <img
                    src={src}
                    alt="thumb"
                    style={{ width: `${thumbSize}px`, height: "auto" }}
                    className="object-contain rounded-md border border-gray-300"
                  />
                </div>
              </div>
            ))}

            {images.length === 0 && (
              <p className="text-gray-600 col-span-full text-center">
                No images available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPage;
