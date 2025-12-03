import { useState, useEffect, useRef } from "react";

const COLORS = [
  // Single Colours
  { name: "#1 Jet Black", hex: "#0a0a0a" },
  { name: "#1B Off Black", hex: "#1c1c1c" },
  { name: "#1C Expresso Brown", hex: "#3b2f2f" },
  { name: "#2B Dark Amber", hex: "#4b2e2b" },
  { name: "#2C Coco loco", hex: "#4e3629" },
  { name: "#3A Midnight Mocha", hex: "#4a3f35" },
  { name: "#4B Tosted Caramel", hex: "#a56536" },
  { name: "#4C Espresso Martini", hex: "#5c3a2e" },
  { name: "#5 Medium Ash Brown", hex: "#8c756a" },
  { name: "#5A Chestnut Charm", hex: "#7b4a2e" },
  { name: "#6 Brown", hex: "#7a4f35" },
  { name: "#6A Medium Ash", hex: "#9c8f87" },
  { name: "#8A Butterscotch Bliss", hex: "#d4a96e" },
  { name: "#10A Honeycomb Haze", hex: "#e3c08b" },
  { name: "#12 Copper Blonde", hex: "#d78c4b" },
  { name: "#13A Fudge", hex: "#a86442" },
  { name: "#14 Dark Blonde", hex: "#c3a56b" },
  { name: "#16 Beige Blonde", hex: "#d8c5a2" },
  { name: "#18 Honey Blonde", hex: "#e4cfa3" },
  { name: "#18A Cool honey Blonde", hex: "#d4c6a1" },
  { name: "#24 Golden Blonde", hex: "#f0d28a" },
  { name: "#27 Strawberry Blonde", hex: "#d9895b" },
  { name: "#30 Light Auburn", hex: "#b35c3b" },
  { name: "#30A Cranberry Kiss", hex: "#a23f3f" },
  { name: "#33 Copper Red", hex: "#a43d1f" },
  { name: "#50 Light Silver Grey", hex: "#cfcfcf" },
  { name: "#60A Light Platinum Ash Blonde", hex: "#f2f2f2" },
  { name: "#62 Light Ash Blonde", hex: "#ebdfd1" },
  { name: "#64 Champagne Blonde", hex: "#edd7b5" },
  { name: "#98J Mahogany", hex: "#5b1e1e" },
  { name: "#99J Burgundy", hex: "#6b2333" },
  { name: "#130 Red Ruby", hex: "#b02020" },
  { name: "#613L Light Bleach Blonde", hex: "#fff2d6" },

  // Highlight
  { name: "#4B/27 Tosted Caramel /Strawberry Blonde", hex: "#c4884a" },
  { name: "#4C/27 Espresso Martini/Strawberry Blonde", hex: "#a06a52" },
  { name: "#6/27 Brown / Strawberry Blonde", hex: "#b57a52" },
  { name: "#10A/16 Honeycomb Haze / Beige Blonde", hex: "#e1caa7" },
  { name: "#13A/16 Fudge/Beige Blonde", hex: "#c09b75" },
  { name: "#13A/24 Fudge/Golden blonde", hex: "#d0a86c" },
  { name: "#14/24 Dark Blonde / Golden Blonde", hex: "#d9b67a" },
  { name: "#60A/62 Light Platinum Ash Blonde/Light Ash Blonde", hex: "#f4eee7" },
  { name: "#613L/16 Light Bleach Blonde / Beige Blonde", hex: "#f5e7c7" },
  { name: "#613L/18A Light Bleach Blonde/ Cool honey Blonde", hex: "#f4e3bd" },
  { name: "#613L/27 Light Bleach Blonde / Strawberry Blonde", hex: "#f2d1a3" },

  // Rooted
  { name: "#2BT6 Dark Amber /Brown", hex: "#4c342a" },
  { name: "#2BT8A Dark Amber /Butterscotch Bliss", hex: "#bc8c57" },
  { name: "#2CT5 Coco loco/Medium Ash Brown", hex: "#7b6252" },
];

const ColorSuggestionInput = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [show, setShow] = useState(false);
  const ref = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = COLORS.filter((c) =>
    c.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const selectColor = (name) => {
    setInputValue(name);
    onChange(name);
    setShow(false);
  };

  return (
    <div className="relative w-full" ref={ref}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          onChange(e.target.value);
          setShow(true);
        }}
        placeholder="Enter Color Name (e.g., Ash Blonde)"
        className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
      />

      {show && inputValue && (
        <div className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl max-h-80 overflow-y-auto p-3 shadow-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3">

          {filtered.map((c) => (
            <div
              key={c.name}
              onClick={() => selectColor(c.name)}
              className="flex items-center gap-3 p-2 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <div
                className="w-8 h-8 rounded-full border border-gray-300"
                style={{ backgroundColor: c.hex }}
              ></div>
              <p className="text-sm">{c.name}</p>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="text-gray-500 p-3 col-span-full text-center">
              No Color Found
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ColorSuggestionInput;