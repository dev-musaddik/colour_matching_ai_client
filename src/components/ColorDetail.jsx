import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getTrainingImagesForColor, uploadTrainingImage, triggerTraining } from '../services/api';

const API_BASE_URL =
//   import.meta.env.VITE_API_BASE || "https://colour-matching-ai-sarver-1.onrender.com";
  import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

const ColorDetail = ({ color, onBack, setLoading }) => {
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isTraining, setIsTraining] = useState(false);

    const fetchImages = useCallback(async () => {
        try {
            setError(null);
            const data = await getTrainingImagesForColor(color.id);
            setImages(data);
        } catch (err) {
            setError(err.message);
        }
    }, [color.id]);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);
        try {
            await uploadTrainingImage(color.id, file);
            fetchImages(); // Refresh image list
        } catch (err) {
            setError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleTrainClick = async () => {
        setIsTraining(true);
        setLoading(true);
        setError(null);
        try {
            const result = await triggerTraining(color.id);
            alert(result.message);
            onBack(); // Go back to the list view to see the status change
        } catch (err) {
            setError(err.message);
        } finally {
            setIsTraining(false);
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-4xl mx-auto"
        >
            <button onClick={onBack} className="mb-6 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                &larr; Back to Color Library
            </button>

            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-md mb-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold">{color.name}</h2>
                <p className="text-gray-500 dark:text-gray-400">{color.description}</p>
                <div className="mt-4">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${color.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        Status: {color.status}
                    </span>
                </div>
            </div>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

            {/* Training Section */}
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-md mb-8 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-4">Train Model</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Upload at least 3 images of this hair color to train the AI model. The more images you provide, the more accurate the model will be.
                </p>
                <button
                    onClick={handleTrainClick}
                    disabled={images.length < 3 || isTraining || color.status === 'training'}
                    className="w-full px-6 py-3 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isTraining || color.status === 'training' ? 'Training in Progress...' : `Train with ${images.length} Images`}
                </button>
            </div>

            {/* Image Upload and Gallery */}
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-4">Training Images</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                    {images.map(img => (
                        <motion.div key={img.id} layout>
                            <img 
                                src={`${API_BASE_URL}${img.image_path}`} 
                                alt={`Training image ${img.id}`}
                                className="w-full h-32 object-cover rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                            />
                        </motion.div>
                    ))}
                    {isUploading && (
                        <div className="w-full h-32 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                    <label className="w-full h-32 bg-gray-50 dark:bg-gray-900/50 rounded-lg flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" disabled={isUploading} />
                        <span className="text-3xl text-gray-400 dark:text-gray-500">+</span>
                    </label>
                </div>
            </div>
        </motion.div>
    );
};

export default ColorDetail;
