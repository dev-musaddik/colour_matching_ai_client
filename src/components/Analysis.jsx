import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeImages } from "../services/api";
import NewResultCard from "./NewResultCard";

const Analysis = ({ setLoading, loading }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (analysisResult && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [analysisResult]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  // --- Resize & compress images before analysis ---
  const resizeImage = (file, maxDim = 1024, minQuality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        let { width, height } = img;
        const scale = Math.min(maxDim / width, maxDim / height, 1); // never upscale
        width = Math.floor(width * scale);
        height = Math.floor(height * scale);

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob.size < 50 * 1024)
              resolve(file); // preserve very small images
            else resolve(new File([blob], file.name, { type: "image/jpeg" }));
          },
          "image/jpeg",
          minQuality
        );
      };

      reader.readAsDataURL(file);
    });
  };

  const processFiles = async (files) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files).slice(0, 5); // limit 5 images
    const resizedFiles = await Promise.all(
      fileArray.map((f) => resizeImage(f))
    );
    setSelectedFiles(resizedFiles);

    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    const newPreviews = resizedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(newPreviews);

    setError(null);
    setAnalysisResult(null);
  };

  const handleFileChange = (event) => {
    processFiles(event.target.files);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length === 0) {
      setError("Please drop valid image files.");
      return;
    }
    processFiles(files);
  }, []);

  const handleAnalyzeClick = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one image.");
      return;
    }
    setLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const data = await analyzeImages(selectedFiles);
      setAnalysisResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearSelection = () => {
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setSelectedFiles([]);
    setImagePreviews([]);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl"
      >
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative group flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-[2.5rem] transition-all duration-300 ease-out
                        ${
                          isDragging
                            ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 scale-[1.02]"
                            : "border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 hover:border-gray-400 dark:hover:border-gray-600"
                        } backdrop-blur-md`}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-200 mt-2">
            {isDragging ? "Drop images here" : "Drag & drop your images"}
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            {selectedFiles.length > 0
              ? `${selectedFiles.length} image${
                  selectedFiles.length > 1 ? "s" : ""
                } selected`
              : "No images selected"}
          </p>
          <AnimatePresence>
            {imagePreviews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex gap-3 mt-6 p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex-wrap justify-center"
              >
                {imagePreviews.map((preview, idx) => (
                  <img
                    key={idx}
                    src={preview}
                    alt={`preview ${idx + 1}`}
                    className="w-20 h-20 rounded-xl object-cover border border-gray-200 dark:border-gray-700"
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <button
            onClick={clearSelection}
            disabled={loading || selectedFiles.length === 0}
            className="px-6 py-3 rounded-xl font-semibold text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
          <button
            onClick={handleAnalyzeClick}
            disabled={loading || selectedFiles.length === 0}
            className="relative overflow-hidden px-8 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing..." : "Analyze with AI"}
          </button>
        </div>
      </motion.div>

      {analysisResult && (
        <motion.div
          ref={resultsRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="w-full max-w-4xl mt-24"
        >
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Analysis Results{" "}
            {analysisResult.num_images > 1 &&
              `(${analysisResult.num_images} Images)`}
          </h3>
          {analysisResult.results && analysisResult.results.length > 0 ? (
            <div className="space-y-6">
              {analysisResult.results.map((result, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <NewResultCard
                    result={result}
                    preview={imagePreviews[result.image_index - 1]}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl text-center text-gray-500">
              No results available
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Analysis;
