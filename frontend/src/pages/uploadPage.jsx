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
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFiles(Array.from(e.dataTransfer.files));
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleSubmit = async () => {
    if (files.length === 0) {
      setUploadMessage("Please select at least one file to upload.");
      return;
    }
    setIsUploading(true);
    try {
      for (const file of files) {
        await uploadPhoto(file, file.name, null, "public");
      }
      setUploadMessage("✅ Upload complete!");
      setFiles([]);
    } catch (err) {
      setUploadMessage("❌ Upload failed: " + err.message);
    } finally {
      setIsUploading(false);
    }
    navigate("/index");
  };

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ backgroundColor: colors.global?.bg }}
    >
      <PaintBrushTool currentPage="upload" imageCount={files.length} />

      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <div
          className="rounded-2xl shadow-xl p-8 text-center w-full max-w-3xl"
          style={{ backgroundColor: colors.global?.box }}
        >
          <button
            onClick={() => navigate("/main")}
            className="text-gray-600 hover:text-gray-800 transition text-2xl font-bold"
          >
            ←
          </button>

          <h1
            className="text-4xl font-bold drop-shadow mb-6"
            style={{ color: colors.global?.title }}
          >
            Upload Page
          </h1>

          {/* Drag-and-drop area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed rounded-xl p-10 mb-4 cursor-pointer"
            style={{ borderColor: "#3B82F6" }}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <p className="text-gray-600">
              Select or Drop Photos Here
            </p>
            <input
              type="file"
              id="fileInput"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-500 text-white rounded"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Submit"}
            </button>
            <button
              onClick={() => setFiles([])}
              className="px-6 py-2 bg-red-500 text-white rounded"
            >
              Clear
            </button>
          </div>

          {uploadMessage && (
            <p className="mt-4 text-sm font-medium">{uploadMessage}</p>
          )}

          {files.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              {files.map((file, idx) => (
                <div key={idx} className="p-3 rounded shadow bg-white">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="max-w-[200px] max-h-[200px] rounded"
                  />
                  <p className="text-sm mt-2">{file.name}</p>
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
