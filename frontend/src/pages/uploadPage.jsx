import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadPhoto } from "../api";
import PaintBrushTool from "../components/paintbrushTool";
import { useTheme } from "../colorCustomiser";

function UploadPage() {
  const { colors } = useTheme();
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setUploadMessage("");
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setUploadMessage("Please select at least one file to upload.");
      return;
    }

    setIsUploading(true);
    setUploadMessage("Uploading...");

    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary credentials not found in environment variables.");
      }

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!cloudinaryResponse.ok) {
          throw new Error("Cloudinary upload failed.");
        }

        const data = await cloudinaryResponse.json();
        const photoUrl = data.secure_url;

        const photoData = {
          title: file.name,
          url: photoUrl,
          description: "Uploaded via frontend.",
        };

        await uploadPhoto(photoData);
      }

      setUploadMessage("All photos uploaded successfully!");
      setFiles([]);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadMessage(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ backgroundColor: colors.global?.bg }}
    >
      {/* ✅ PaintBrushTool for UploadPage */}
      <PaintBrushTool currentPage="upload" imageCount={files.length} />

      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <div
          className="rounded-2xl shadow-xl p-8 text-center w-full max-w-3xl min-h-[300px] flex flex-col space-y-6"
          style={{ backgroundColor: colors.global?.box }}
        >
          <div className="w-full flex justify-start">
            <button
              onClick={() => navigate("/main")}
              className="text-gray-600 hover:text-gray-800 transition text-2xl font-bold"
            >
              ←
            </button>
          </div>

          <h1
            className="text-4xl font-bold drop-shadow"
            style={{ color: colors.global?.title }}
          >
            Upload Page
          </h1>

          <input
            type="file"
            id="fileInput"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <label
              htmlFor="fileInput"
              className="px-6 py-3 rounded-xl shadow-md hover:opacity-80 transition font-medium cursor-pointer"
              style={{
                backgroundColor: colors.uploadPage?.selectBtn || "#3B82F6",
                color: colors.global?.text,
              }}
            >
              Select Photos
            </label>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 rounded-xl shadow-md hover:opacity-80 transition font-medium"
              style={{
                backgroundColor: colors.uploadPage?.submitBtn || "#10B981",
                color: colors.global?.text,
              }}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Submit"}
            </button>
          </div>

          {uploadMessage && <p className="mt-4 text-sm font-medium">{uploadMessage}</p>}

          {files.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-6">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl shadow-md flex flex-col items-center"
                  style={{
                    backgroundColor:
                      colors.uploadPage?.imageBoxes?.[idx] || "#ffffff",
                  }}
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="max-w-[300px] max-h-[300px] rounded-lg object-contain"
                  />
                  <p
                    className="text-sm mt-2 truncate max-w-[280px]"
                    style={{ color: colors.global?.text }}
                  >
                    {file.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
