import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ColorSuggestionInput from "./ColorSuggestionInput"; // Make sure path is correct
import { createColorAndTrain } from "../services/api"; // Your API function

const TrainingWizard = ({ onComplete, onCancel, setLoading }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [colorName, setColorName] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingMessage, setTrainingMessage] = useState("");
  const [isTraining, setIsTraining] = useState(false);

  const processFiles = (newFiles) => {
    if (newFiles.length === 0) return;
    const allFiles = [...files, ...Array.from(newFiles)].slice(0, 5); // Max 5 images
    setFiles(allFiles);

    previews.forEach(URL.revokeObjectURL);
    const newPreviews = allFiles.map((f) => URL.createObjectURL(f));
    setPreviews(newPreviews);
  };

  const handleFileChange = (e) => processFiles(e.target.files);
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [files]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length < 1) {
      setError("Please upload at least 1 image.");
      return;
    }
    if (!colorName) {
      setError("Color name is missing.");
      return;
    }

    setLoading(true);
    setIsTraining(true);
    setError("");
    setTrainingProgress(0);
    setTrainingMessage("Starting training...");
    
    try {
      console.log(colorName, files);
      await createColorAndTrain(colorName, files, (percentage, message, status) => {
        setTrainingProgress(percentage);
        setTrainingMessage(message);
      });
      
      setTrainingMessage("Training complete!");
      setTrainingProgress(100);
      
      setTimeout(() => {
        onComplete();
      }, 1500);
    } catch (err) {
      setError(err.message);
      setIsTraining(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-2">Train a New Color</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Upload 1-5 images, give your color a name, and the AI will learn it.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Progress Bar */}
        {isTraining && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                {trainingMessage}
              </span>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                {trainingProgress}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${trainingProgress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              />
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Upload */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative group flex flex-col items-center justify-center p-8 mb-6 border-2 border-dashed rounded-xl transition-colors ${
              isDragging
                ? "border-indigo-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <p className="font-semibold text-gray-700 dark:text-gray-300">
              Drag & drop images or click to browse
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              ({files.length} / 5 selected)
            </p>
          </div>

          <AnimatePresence>
            {previews.length > 0 && (
              <motion.div className="flex gap-3 mb-6 overflow-x-auto">
                {previews.map((p, i) => (
                  <img
                    key={i}
                    src={p}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 2: Name (Permanent, Non-editable) */}
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <label className="font-bold text-lg mb-2 block">
                Name this Color
              </label>
              <ColorSuggestionInput
                value={colorName}
                onChange={setColorName}
              />
            </motion.div>
          )}

          {/* Step 3: Submit */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 rounded-lg font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={files.length < 1 || !colorName}
              className="px-6 py-2 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-400"
            >
              Create & Train
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TrainingWizard;
