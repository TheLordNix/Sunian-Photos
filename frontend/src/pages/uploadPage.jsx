import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UploadPage() {
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setSubmitted(false); // reset previews if new selection
  };

  const handleSubmit = () => {
    if (files.length > 0) {
      setSubmitted(true);
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
        <div className="bg-[rgba(240,192,133,1)] rounded-2xl shadow-xl p-8 text-center w-full max-w-3xl min-h-[300px] flex flex-col space-y-6">
          {/* Back button */}
          <div className="w-full flex justify-start">
            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-800 transition text-2xl font-bold"
            >
              ←
            </button>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-800 drop-shadow">
            Upload Page
          </h1>

          {/* File input (hidden) */}
          <input
            type="file"
            id="fileInput"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <label
              htmlFor="fileInput"
              className="px-6 py-3 bg-gray-100 rounded-xl shadow-md hover:bg-gray-200 transition font-medium cursor-pointer"
            >
              Select Photos
            </label>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600 transition font-medium"
            >
              Submit
            </button>
          </div>

          {/* Preview area */}
          {submitted && files.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-6">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="bg-gray-200 p-3 rounded-xl shadow-md flex flex-col items-center"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="max-w-[300px] max-h-[300px] rounded-lg object-contain"
                  />
                  <p className="text-sm mt-2 text-gray-700 truncate max-w-[280px]">
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
