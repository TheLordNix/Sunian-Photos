import { useState } from "react";
import { useTheme } from "../ThemeContext";

function ColorCustomizer() {
  const { setColors } = useTheme();
  const [open, setOpen] = useState(false);

  const handleChange = (key, value) => {
    setColors((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="absolute top-4 left-4">
      {/* Paintbrush toggle */}
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
            ["paintbrush", "Paintbrush"],
          ].map(([key, label]) => (
            <label key={key} className="flex justify-between items-center">
              <span className="text-sm">{label}</span>
              <input type="color" onChange={(e) => handleChange(key, e.target.value)} />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default ColorCustomizer;
