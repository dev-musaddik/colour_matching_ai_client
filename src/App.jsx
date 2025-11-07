import { useState } from "react";
import { motion } from "framer-motion";
import "./App.css";

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [analysisResults, setAnalysisResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 3) {
      setError("You can only select up to 3 images.");
      return;
    }
    setSelectedFiles(files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previewUrls);
    setError(null);
  };

  const handleAnalyzeClick = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select one or more files first.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResults([]);

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch("http://localhost:8000/analyze-hair-color", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Something went wrong");
      }

      const data = await response.json();
      setAnalysisResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center p-6">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white drop-shadow-lg">
          Hair Color Analyzer 🎨
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Upload up to 3 images to analyze dominant hair colors
        </p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-3xl shadow-xl p-8 transition-all"
      >
        {/* File Input */}
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
          />

          {/* Image Previews */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {imagePreviews.map((preview, index) => (
              <motion.img
                key={index}
                src={preview}
                alt={`Selected preview ${index + 1}`}
                className="w-32 h-32 object-cover rounded-2xl shadow-md border border-gray-300 dark:border-gray-700 hover:scale-105 transition-transform"
                whileHover={{ scale: 1.05 }}
              />
            ))}
          </div>

          <button
            onClick={handleAnalyzeClick}
            disabled={loading}
            className={`mt-6 px-6 py-3 rounded-2xl font-semibold text-white shadow-md transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-500"
            }`}
          >
            {loading ? "Analyzing..." : "Analyze Hair Color"}
          </button>

          {error && (
            <p className="text-red-500 font-medium mt-4 bg-red-100 dark:bg-red-900/40 px-4 py-2 rounded-xl">
              ⚠️ {error}
            </p>
          )}
        </div>
      </motion.div>

      {/* Results */}
      {analysisResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 w-full max-w-4xl"
        >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-6">
            Analysis Results
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {analysisResults.map((result, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 shadow-lg p-6 flex flex-col md:flex-row gap-4"
              >
                <img
                  src={imagePreviews[index]}
                  alt={result.filename}
                  className="w-40 h-40 object-cover rounded-xl border border-gray-300 dark:border-gray-700 shadow-md"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                    {result.filename}
                  </h4>
                  {result.error ? (
                    <p className="text-red-500 mt-2">Error: {result.error}</p>
                  ) : (
                    <>
                      {/* Dominant Hair Colors */}
                      <div className="mt-4">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                          Dominant Hair Colors
                        </h3>
                        <div className="flex flex-wrap gap-3 mt-2">
                          {result.dominant_hair_colors.map((color, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2"
                            >
                              <div
                                className="w-6 h-6 rounded-full border border-gray-400"
                                style={{ backgroundColor: color }}
                              ></div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {color}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Top Matching Color Sets */}
                      <div className="mt-4">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                          Top Matching Color Sets
                        </h3>
                        {result.closest_hair_color_sets.map((set, i) => (
                          <div key={i} className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <strong>Set Name:</strong> {set.set_name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <strong>Similarity:</strong> {set.similarity_percentage}
                            </p>
                            <div className="flex flex-wrap gap-3 mt-2">
                              {set.matched_colors.map((color, j) => (
                                <div key={j} className="flex items-center gap-2">
                                  <div
                                    className="w-6 h-6 rounded-full border border-gray-400"
                                    style={{ backgroundColor: color }}
                                  ></div>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {color}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default App;
