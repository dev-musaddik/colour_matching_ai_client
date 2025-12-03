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
            imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [imagePreviews]);

    const processFiles = (files) => {
        if (!files || files.length === 0) return;
        
        // Limit to 5 images
        const fileArray = Array.from(files).slice(0, 5);
        setSelectedFiles(fileArray);
        
        // Clean up old previews
        imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
        
        // Create new previews
        const newPreviews = fileArray.map(file => URL.createObjectURL(file));
        setImagePreviews(newPreviews);
        
        setError(null);
        setAnalysisResult(null);
    };

    const handleFileChange = (event) => {
        processFiles(event.target.files);
    };

    const handleDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
    const handleDragLeave = useCallback((e) => { e.preventDefault(); setIsDragging(false); }, []);
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
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
        imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
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
                        ${isDragging ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 scale-[1.02]" : "border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 hover:border-gray-400 dark:hover:border-gray-600"} backdrop-blur-md`}
                >
                    <input type="file" accept="image/*" multiple onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                    <div className={`p-5 mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 transition-transform duration-300 ${isDragging ? "scale-110" : "group-hover:scale-110"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                    </div>
                    <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">{isDragging ? "Drop images here" : "Drag & drop your images"}</p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">or click to browse (1-5 images)</p>
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                        {selectedFiles.length > 0 ? `${selectedFiles.length} image${selectedFiles.length > 1 ? 's' : ''} selected` : 'No images selected'}
                    </p>
                    <AnimatePresence>
                        {imagePreviews.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex gap-3 mt-6 p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 z-30 flex-wrap justify-center"
                            >
                                {imagePreviews.map((preview, idx) => (
                                    <img key={idx} src={preview} alt={`preview ${idx + 1}`} className="w-20 h-20 rounded-xl object-cover border border-gray-200 dark:border-gray-700" />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full md:w-auto px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl text-center flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div className="flex gap-3 w-full md:w-auto justify-center">
                        <button onClick={clearSelection} disabled={loading || selectedFiles.length === 0} className="px-6 py-3 rounded-xl font-semibold text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Reset</button>
                        <button onClick={handleAnalyzeClick} disabled={loading || selectedFiles.length === 0} className="relative overflow-hidden px-8 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed">
                            {loading ? "Analyzing..." : "Analyze with AI"}
                        </button>
                    </div>
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
                        Analysis Results {analysisResult.num_images > 1 && `(${analysisResult.num_images} Images)`}
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
                                    <div className="mb-3 flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                            Image {result.image_index} {result.filename && `• ${result.filename}`}
                                        </span>
                                        {result.cached && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                CACHED
                                            </span>
                                        )}
                                    </div>
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
