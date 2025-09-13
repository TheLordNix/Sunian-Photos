import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PaintBrushTool from "../components/paintbrushTool";
import { useTheme } from "../colorCustomiser";

function IndexPage() {
  const navigate = useNavigate();
  const { colors } = useTheme();

  const [images, setImages] = useState([]);
  const [originalImages, setOriginalImages] = useState([]);
  const [likes, setLikes] = useState({});
  const [commentsCount, setCommentsCount] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // ✅ Comments modal
  const [commentModal, setCommentModal] = useState({
    open: false,
    imageId: null,
    comments: [],
  });

  const userEmail = localStorage.getItem("userEmail") || "guest@example.com";

  // ✅ Fetch images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch("http://localhost:8000/api/images", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load images");

        const responseData = await res.json();
        const imagesArray = responseData.images;

        const formatted = imagesArray.map((img) => ({
          id: img.id,
          src: img.url,
          size: img.width || 200,
          height: img.height || 200,
        }));

        setImages(formatted);
        setOriginalImages(formatted);

        // init likes + comments
        const initialLikes = {};
        const initialComments = {};
        imagesArray.forEach((img) => {
          const userLiked =
            img.likes && img.likes.includes(userEmail) ? true : false;
          initialLikes[img.id] = {
            count: img.likes ? img.likes.length : 0,
            liked: userLiked,
          };
          initialComments[img.id] = img.comments_count || 0;
        });
        setLikes(initialLikes);
        setCommentsCount(initialComments);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [userEmail]);

  // ✅ Reorder
  const moveImage = async (idx, direction) => {
    const newImages = [...images];
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= newImages.length) return;

    [newImages[idx], newImages[swapIdx]] = [newImages[swapIdx], newImages[idx]];
    setImages(newImages);

    try {
      const token = localStorage.getItem("authToken");
      await fetch("http://localhost:8000/api/images/reorder", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newImages.map((img) => img.id)),
      });
    } catch (err) {
      console.error("Reorder failed:", err);
    }
  };

  // ✅ Resize
  const resizeImage = (idx, size) => {
    const newImages = [...images];
    newImages[idx].size = size;
    setImages(newImages);
  };

  // ✅ Delete
  const deleteImage = async (idx) => {
    const img = images[idx];
    try {
      const token = localStorage.getItem("authToken");
      await fetch(`http://localhost:8000/api/images/${img.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setImages(images.filter((_, i) => i !== idx));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const clearAll = () => setImages([]);
  const reset = () => setImages(originalImages);
  const save = () => {
    setIsEditing(false);
    alert("Changes saved!");
  };

  // ✅ Likes toggle
  const handleLike = async (id) => {
    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch(`http://localhost:8000/api/images/${id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_email: userEmail }), // use user_email
      });

      const data = await res.json();
      setLikes((prev) => ({
        ...prev,
        [id]: { count: data.total_likes, liked: data.liked },
      }));
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  // ✅ Comments modal open
  const openComments = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/images/${id}/comments`);
      const data = await res.json();
      setCommentModal({ open: true, imageId: id, comments: data });
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  const closeComments = () =>
    setCommentModal({ open: false, imageId: null, comments: [] });

  // ✅ Submit comment
  const submitComment = async (id, content) => {
    if (!content.trim()) return;
    try {
      const res = await fetch(`http://localhost:8000/api/images/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_email: userEmail, content }), // use user_email
      });
      const data = await res.json();
      setCommentModal((prev) => ({
        ...prev,
        comments: [...prev.comments, data],
      }));
      setCommentsCount((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }));
      document.getElementById("newComment").value = ""; // clear textarea
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  // ✅ Lightbox controls
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
              className={`grid gap-6 ${isEditing ? "auto-rows-auto" : ""}`}
              style={{
                gridTemplateColumns: isEditing
                  ? "repeat(auto-fill, minmax(200px, 1fr))"
                  : "repeat(auto-fill, minmax(250px, 1fr))",
              }}
            >
              {images.map((img, idx) => {
                const colSpan = img.size > 400 ? "col-span-2" : "col-span-1";
                const rowSpan = img.height > 400 ? "row-span-2" : "row-span-1";

                return (
                  <div
                    key={img.id}
                    className={`p-4 rounded-xl shadow-md flex flex-col justify-between h-full ${colSpan} ${rowSpan}`}
                    style={{
                      backgroundColor:
                        colors.galleryPage?.imageBoxes?.[idx] || "#ffffff",
                    }}
                  >
                    {/* Image */}
                    <div className="flex-grow flex items-center justify-center w-full">
                      <img
                        src={img.src}
                        alt={`Image ${idx + 1}`}
                        className="max-h-[400px] w-full object-contain rounded-lg cursor-pointer"
                        onClick={() => openLightbox(idx)}
                      />
                    </div>

                    {/* Likes + Comments Counts */}
                    <div className="flex items-center gap-4 mt-3 text-gray-700">
                      <button
                        onClick={() => handleLike(img.id)}
                        className={`px-3 py-1 rounded ${
                          likes[img.id]?.liked ? "bg-pink-600" : "bg-pink-500"
                        } text-white`}
                      >
                        {likes[img.id]?.liked ? "💔 Unlike" : "❤️ Like"}
                      </button>
                      <span>{likes[img.id]?.count || 0} Likes</span>
                      <button
                        onClick={() => openComments(img.id)}
                        className="text-blue-500 underline"
                      >
                        💬 {commentsCount[img.id] || 0} Comments
                      </button>
                    </div>

                    {/* Edit controls */}
                    {isEditing && (
                      <>
                        <div className="mt-4 w-full">
                          <label className="text-sm text-gray-600">
                            Image Size ({img.size}px)
                          </label>
                          <input
                            type="range"
                            min="100"
                            max="500"
                            value={img.size}
                            onChange={(e) =>
                              resizeImage(idx, parseInt(e.target.value))
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
                );
              })}
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

      {/* ✅ Image Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
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
            src={images[lightboxIndex]?.src}
            alt={`Image ${lightboxIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] rounded-lg relative z-50 object-contain"
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

      {/* ✅ Comments Modal */}
      {commentModal.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg z-50 relative">
            <button
              onClick={closeComments}
              className="absolute top-3 right-3 text-gray-600 text-2xl"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Comments</h2>
            <div className="max-h-64 overflow-y-auto space-y-3 mb-4">
              {commentModal.comments.map((c, i) => (
                <div key={i} className="p-2 border-b border-gray-200">
                  <p className="text-sm text-gray-800">{c.content}</p>
                  <p className="text-xs text-gray-500">
                    by {c.user_email || "guest@example.com"}
                  </p>
                </div>
              ))}
            </div>
            <textarea
              id="newComment"
              className="w-full p-2 border rounded"
              placeholder="Write a comment..."
            />
            <button
              onClick={() =>
                submitComment(
                  commentModal.imageId,
                  document.getElementById("newComment").value
                )
              }
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default IndexPage;
