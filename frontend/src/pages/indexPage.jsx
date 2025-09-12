import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PaintBrushTool from "../components/paintbrushTool";
import { useTheme } from "../colorCustomiser";

function IndexPage() {
  const navigate = useNavigate();
  const { colors } = useTheme();

  const [images, setImages] = useState([]);
  const [comments, setComments] = useState({});
  const [originalImages, setOriginalImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // 🔍 Lightbox modal state
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // ✅ Fetch images OR fallback to placeholders
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch("http://localhost:8000/api/images", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load images");
        const data = await res.json();

        const formatted = data.map((img) => ({
          src: img.storage_path,
          size: 200,
          thumb: 100,
        }));

        if (formatted.length > 0) {
          setImages(formatted);
          setOriginalImages(formatted);
        } else {
          // fallback placeholders
          const placeholders = [
            { src: "https://via.placeholder.com/300x200", size: 200, thumb: 100 },
            { src: "https://via.placeholder.com/250x250", size: 200, thumb: 100 },
            { src: "https://via.placeholder.com/280x180", size: 200, thumb: 100 },
          ];
          setImages(placeholders);
          setOriginalImages(placeholders);
        }
      } catch (err) {
        console.error("Error loading images:", err);
        // fallback placeholders if API fails
        const placeholders = [
          { src: "https://via.placeholder.com/300x200", size: 200, thumb: 100 },
          { src: "https://via.placeholder.com/250x250", size: 200, thumb: 100 },
          { src: "https://via.placeholder.com/280x180", size: 200, thumb: 100 },
        ];
        setImages(placeholders);
        setOriginalImages(placeholders);
      }
    };

    fetchImages();
  }, []);

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

  const handleCommentChange = (idx, value) =>
    setComments((prev) => ({ ...prev, [idx]: value }));

  const handleCommentSubmit = (idx) => {
    if (comments[idx]) {
      alert(`Comment on Image ${idx + 1}: ${comments[idx]}`);
      setComments((prev) => ({ ...prev, [idx]: "" }));
    }
  };

  // 🔍 Lightbox controls
  const openLightbox = (idx) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const showPrev = () =>
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : prev));
  const showNext = () =>
    setLightboxIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev));

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ backgroundColor: colors.global?.bg }}
    >
      <PaintBrushTool currentPage="gallery" imageCount={images.length} />

      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <div
          className="rounded-2xl shadow-xl p-8 w-full max-w-6xl min-h-[480px] relative"
          style={{ backgroundColor: colors.global?.box }}
        >
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => navigate("/main")}
              className="text-gray-600 hover:text-gray-800 transition text-2xl font-bold"
            >
              ←
            </button>
            <button
              onClick={() => setIsEditing((prev) => !prev)}
              className="text-gray-600 hover:text-gray-800 transition text-lg font-semibold"
            >
              {isEditing ? "✔ Done" : "✎ Edit"}
            </button>
          </div>

          <h1
            className="text-4xl font-bold text-center mb-8"
            style={{ color: colors.global?.title }}
          >
            Gallery
          </h1>

          {images.length > 0 ? (
            <div
              className={`grid ${
                isEditing
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
              } gap-8`}
            >
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl shadow-md flex flex-col items-center"
                  style={{
                    backgroundColor:
                      colors.galleryPage?.imageBoxes?.[idx] || "#ffffff",
                  }}
                >
                  <img
                    src={img.src}
                    alt={`Image ${idx + 1}`}
                    style={{ width: img.size, height: "auto" }}
                    className="rounded-lg object-contain cursor-pointer"
                    onClick={() => openLightbox(idx)}
                  />

                  {/* Comment Section */}
                  <textarea
                    value={comments[idx] || ""}
                    onChange={(e) => handleCommentChange(idx, e.target.value)}
                    placeholder="Write a comment..."
                    className="mt-4 w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-400 outline-none"
                    style={{
                      color: colors.global?.text,
                      backgroundColor: colors.global?.bg,
                    }}
                  />
                  <button
                    onClick={() => handleCommentSubmit(idx)}
                    className="mt-3 px-5 py-2 rounded-lg shadow-md hover:opacity-90 transition font-medium"
                    style={{
                      backgroundColor: "#3B82F6",
                      color: colors.global?.text,
                    }}
                  >
                    Submit
                  </button>

                  {/* Edit Controls */}
                  {isEditing && (
                    <>
                      <div className="mt-4 w-full">
                        <label className="text-sm text-gray-600">
                          Image Size ({img.size}px)
                        </label>
                        <input
                          type="range"
                          min="100"
                          max="400"
                          value={img.size}
                          onChange={(e) =>
                            resizeImage(idx, parseInt(e.target.value))
                          }
                          className="w-full"
                        />
                      </div>
                      <div className="mt-2 w-full">
                        <label className="text-sm text-gray-600">
                          Thumbnail Size ({img.thumb}px)
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="200"
                          value={img.thumb}
                          onChange={(e) =>
                            resizeThumb(idx, parseInt(e.target.value))
                          }
                          className="w-full"
                        />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => moveImage(idx, -1)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveImage(idx, 1)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => deleteImage(idx)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center">
              No images uploaded yet. Go to Upload Page to add some.
            </p>
          )}

          {isEditing && (
            <div className="flex justify-between mt-8">
              <button
                onClick={clearAll}
                className="px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
              >
                Clear All
              </button>
              <div className="flex gap-4">
                <button
                  onClick={reset}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600"
                >
                  Reset
                </button>
                <button
                  onClick={save}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🔍 Lightbox Modal with blurred background */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* blurred background of gallery */}
          <div className="absolute inset-0 backdrop-blur-lg bg-black/40"></div>

          <button
            onClick={closeLightbox}
            className="absolute top-4 right-6 text-white text-4xl font-bold z-50"
          >
            ✕
          </button>
          <button
            onClick={showPrev}
            disabled={lightboxIndex === 0}
            className="absolute left-6 text-white text-5xl px-3 disabled:opacity-30 z-50"
          >
            ‹
          </button>
          <img
            src={images[lightboxIndex].src}
            alt={`Image ${lightboxIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] rounded-lg relative z-50"
          />
          <button
            onClick={showNext}
            disabled={lightboxIndex === images.length - 1}
            className="absolute right-6 text-white text-5xl px-3 disabled:opacity-30 z-50"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export default IndexPage;
