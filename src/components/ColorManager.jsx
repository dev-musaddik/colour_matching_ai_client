import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getColors, createColor, deleteColor } from '../services/api';

const ColorManager = ({ setSelectedColor, setShowTrainingWizard }) => {
    const [colors, setColors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchColors = async () => {
        try {
            setError(null);
            const data = await getColors();
            setColors(data);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchColors().finally(() => setIsLoading(false));

        const intervalId = setInterval(fetchColors, 10000); // Poll every 10 seconds (reduced from 5)

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    const handleDeleteColor = async (colorId, colorName) => {
        if (window.confirm(`Are you sure you want to delete "${colorName}"? This will delete all associated training data and models.`)) {
            try {
                await deleteColor(colorId);
                fetchColors(); // Refresh the list
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (isLoading) {
        return <div className="text-center p-10">Loading color library...</div>;
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto"
        >
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
            
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Color Library</h2>
                <button 
                    onClick={() => setShowTrainingWizard(true)}
                    className="px-5 py-2 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
                >
                    + Train New Color
                </button>
            </div>

            {/* Color List */}
            <div className="space-y-3">
                <AnimatePresence>
                    {colors.length === 0 && !isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center p-10 bg-white dark:bg-gray-800/50 rounded-xl"
                        >
                            <p className="font-semibold">Your color library is empty.</p>
                            <p className="text-gray-500 dark:text-gray-400">Click "Train New Color" to teach the AI a new hair color.</p>
                        </motion.div>
                    )}
                    {colors.map(color => (
                        <motion.div
                            key={color.id}
                            layout
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
                        >
                            <div className="flex-grow cursor-pointer" onClick={() => setSelectedColor(color)}>
                                <h3 className="font-bold">{color.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{color.description || 'No description'}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteColor(color.id, color.name);
                                    }}
                                    className="p-2 rounded-md text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default ColorManager;
