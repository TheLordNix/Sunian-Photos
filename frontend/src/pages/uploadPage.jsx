import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaintBrushTool from "../components/paintbrushTool";
import { useTheme } from "../colorCustomiser";

function UploadPage() {
  const { colors } = useTheme();
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (files.length > 0) setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: colors.bg }}>
      <PaintBrushTool />

      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <div className="rounded-2xl shadow-xl p-8 text-center w-full max-w-3xl min-h-[300px] flex flex-col space-y-6"
          style={{ backgroundColor: colors.box }}
        >
          <div className="w-full flex justify-start">
            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-800 transition text-2xl font-bold"
            >
              ←
            </button>
          </div>

          <h1 className="text-4xl font-bold drop-shadow" style={{ color: colors.title }}>
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
              className="px-6 py-3 rounded-xl shadow-md hover:bg-gray-200 transition font-medium cursor-pointer"
              style={{ backgroundColor: colors.button, color: colors.text }}
            >
              Select Photos
            </label>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 rounded-xl shadow-md hover:opacity-90 transition font-medium"
              style={{ backgroundColor: colors.button, color: colors.text }}
            >
              Submit
            </button>
          </div>

          {submitted && files.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-6">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl shadow-md flex flex-col items-center"
                  style={{ backgroundColor: colors.imageBox }}
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="max-w-[300px] max-h-[300px] rounded-lg object-contain"
                  />
                  <p className="text-sm mt-2 truncate max-w-[280px]" style={{ color: colors.text }}>
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
