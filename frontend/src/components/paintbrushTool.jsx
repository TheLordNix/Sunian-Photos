import { useState } from "react";
import { useTheme } from "../colorCustomiser";

function PaintBrushTool() {
  const { colors, setColors } = useTheme();
  const [open, setOpen] = useState(false);

  // Default theme values
  const defaultColors = {
    bg: "rgba(121,255,255,1)",
    box: "rgba(240,192,133,1)",
    title: "rgba(255,102,0,1)",
    text: "#ffffff",
    button: "#3B82F6",
    imageBox: "#ffffff",
  };

  const handleChange = (key, value) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setColors(defaultColors);
  };

  return (
    <div className="absolute top-4 left-4 z-[1000]">
      {/* 🎨 button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-4 rounded-full shadow-md hover:scale-110 transition"
        style={{ backgroundColor: "white" }}
      >
        🎨
      </button>

      {open && (
        <div className="mt-4 bg-white p-4 rounded-xl shadow-lg grid gap-3 w-56">
          <h2 className="font-bold text-gray-700 text-center">
            Customize Colors
          </h2>

          {[
            ["bg", "Background"],
            ["box", "Box"],
            ["title", "Title"],
            ["text", "Text"],
            ["button", "Button"],
            ["imageBox", "Image Box"],
          ].map(([key, label]) => (
            <label key={key} className="flex justify-between items-center">
              <span className="text-sm">{label}</span>
              <input
                type="color"
                value={colors[key]}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            </label>
          ))}

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
          >
            Reset to Default
          </button>
        </div>
      )}
    </div>
  );
}

export default PaintBrushTool;
