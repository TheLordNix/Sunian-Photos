import { useState } from "react";
import { useTheme } from "../colorCustomiser";

function PaintBrushTool({ currentPage, imageCount = 0 }) {
  const { colors, setColors } = useTheme();
  const [open, setOpen] = useState(false);

  const handleChange = (path, key, value, idx = null) => {
    setColors((prev) => {
      const updated = structuredClone(prev);

      if ((path === "galleryPage" || path === "uploadPage") && idx !== null) {
        if (!updated[path].imageBoxes) updated[path].imageBoxes = {};
        updated[path].imageBoxes[idx] = value;
      } else {
        if (!updated[path]) updated[path] = {};
        updated[path][key] = value;
      }
      return updated;
    });
  };

  const handleReset = () => {
    setColors({
      global: {
        bg: "rgba(121,255,255,1)",
        box: "rgba(240,192,133,1)",
        title: "rgba(255,102,0,1)",
        text: "#ffffff",
      },
      mainPage: {
        galleryBtn: "#3B82F6",
        uploadBtn: "#3B82F6",
        logoutBtn: "#3B82F6",
      },
      uploadPage: {
        selectBtn: "#3B82F6",
        submitBtn: "#3B82F6",
        imageBoxes: {},
      },
      galleryPage: { imageBoxes: {} },
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(colors, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "themeColors.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);

        // ✅ ensure shape is correct
        if (!imported.global || !imported.mainPage || !imported.uploadPage || !imported.galleryPage) {
          alert("Invalid theme format!");
          return;
        }

        setColors(imported);

        // ✅ also update localStorage so reload persists
        localStorage.setItem("themeColors", JSON.stringify(imported));
      } catch {
        alert("Invalid theme file!");
      }
    };
    reader.readAsText(file);
  };

  let editableFields = [];

  if (currentPage === "main") {
    editableFields = [
      ["bg", "Background", "global"],
      ["box", "Box", "global"],
      ["title", "Title", "global"],
      ["text", "Text", "global"],
      ["galleryBtn", "Gallery Button", "mainPage"],
      ["uploadBtn", "Upload Button", "mainPage"],
      ["logoutBtn", "Logout Button", "mainPage"],
    ];
  } else if (currentPage === "upload") {
    editableFields = [
      ["bg", "Background", "global"],
      ["box", "Box", "global"],
      ["title", "Title", "global"],
      ["text", "Text", "global"],
      ["selectBtn", "Select Button", "uploadPage"],
      ["submitBtn", "Submit Button", "uploadPage"],
    ];
    for (let i = 0; i < imageCount; i++) {
      editableFields.push([`imageBox_${i}`, `Image Box ${i + 1}`, "uploadPage", i]);
    }
  } else if (currentPage === "gallery") {
    editableFields = [
      ["bg", "Background", "global"],
      ["box", "Box", "global"],
      ["title", "Title", "global"],
      ["text", "Text", "global"],
    ];
    for (let i = 0; i < imageCount; i++) {
      editableFields.push([`imageBox_${i}`, `Image Box ${i + 1}`, "galleryPage", i]);
    }
  } else {
    editableFields = [
      ["bg", "Background", "global"],
      ["box", "Box", "global"],
      ["title", "Title", "global"],
      ["text", "Text", "global"],
    ];
  }

  return (
    <div className="absolute top-4 left-4 z-[1000]">
      <button
        onClick={() => setOpen(!open)}
        className="p-4 rounded-full shadow-md hover:scale-110 transition"
        style={{ backgroundColor: "white" }}
      >
        🎨
      </button>

      {open && (
        <div className="mt-4 bg-white p-4 rounded-xl shadow-lg grid gap-3 w-64 max-h-[70vh] overflow-y-auto">
          <h2 className="font-bold text-gray-700 text-center">
            Customize Colors
          </h2>

          {editableFields.map(([key, label, path, idx]) => (
            <label key={key} className="flex justify-between items-center">
              <span className="text-sm">{label}</span>
              <input
                type="color"
                value={
                  (path === "galleryPage" || path === "uploadPage") && idx !== undefined
                    ? colors?.[path]?.imageBoxes?.[idx] || "#ffffff"
                    : colors?.[path]?.[key] || "#000000"
                }
                onChange={(e) => handleChange(path, key, e.target.value, idx)}
              />
            </label>
          ))}

          <div className="flex flex-col gap-2 mt-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
            >
              Reset to Default
            </button>

            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
            >
              Export Theme
            </button>

            <label className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition text-center cursor-pointer">
              Import Theme
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={handleImport}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaintBrushTool;
