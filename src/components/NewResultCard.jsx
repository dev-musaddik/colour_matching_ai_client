import React from 'react';
import { motion } from 'framer-motion';

const Chip = ({ label, icon }) => (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm">
      {icon && <span className="opacity-70">{icon}</span>}
      {label}
    </span>
);

const NewResultCard = ({ result, preview }) => {
    if (!result) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-gray-50/50 dark:bg-gray-800/10 rounded-3xl border border-gray-200 dark:border-gray-800/50"
            >
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 text-center">
                    No result data available.
                </p>
            </motion.div>
        );
    }

    if (result.error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-red-50/50 dark:bg-red-900/10 rounded-3xl border border-red-200 dark:border-red-900/50"
            >
                <p className="text-sm font-medium text-red-600 dark:text-red-400 text-center">
                    {result.error}
                </p>
            </motion.div>
        );
    }

    const { analysis_summary, dominant_hair_colors, best_matches } = result;
    
    if (!analysis_summary || !dominant_hair_colors) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-yellow-50/50 dark:bg-yellow-900/10 rounded-3xl border border-yellow-200 dark:border-yellow-900/50"
            >
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400 text-center">
                    Incomplete analysis data.
                </p>
            </motion.div>
        );
    }

    const best_match = best_matches?.[0];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="group relative bg-white dark:bg-[#111] rounded-[2rem] p-6 shadow-xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
            {/* Header with Thumbnail */}
            <div className="flex items-center gap-5 mb-8">
                <div className="relative">
                    <img src={preview} alt="Analyzed" className="w-20 h-20 rounded-2xl object-cover shadow-sm border-2 border-white dark:border-gray-700" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white truncate">Analysis Result</h4>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        <Chip label={`Tone: ${analysis_summary.estimated_tone}`} />
                        <Chip label={`Level: ${analysis_summary.estimated_level}`} />
                        <Chip label={`Style: ${analysis_summary.estimated_style}`} />
                    </div>
                </div>
            </div>

            {/* Main Result Block */}
            {best_match ? (
                <div className="mb-8 p-5 bg-indigo-50/80 dark:bg-indigo-950/30 rounded-3xl border border-indigo-100 dark:border-indigo-900/50">
                    <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-1">Top Match</p>
                    <h5 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-2">{best_match.name}</h5>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-2.5 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${best_match.combined_score * 100}%` }}
                                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                            />
                        </div>
                        <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300 min-w-[3.5rem] text-right">
                            {Math.round(best_match.combined_score * 100)}%
                        </span>
                    </div>
                </div>
            ) : (
                <div className="mb-8 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-3xl text-center text-gray-500">
                    No close match found in the trained models.
                </div>
            )}

            {/* Color Palette Section */}
            <div className="mb-6">
                <h6 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Pigment Breakdown</h6>
                <div className="space-y-3">
                    {dominant_hair_colors.slice(0, 3).map((color, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl shadow-sm" style={{ backgroundColor: color.hex }} />
                            <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-mono text-gray-500 dark:text-gray-400">{color.hex}</span>
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">{Math.round(color.percentage)}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full"><div className="h-full rounded-full" style={{ width: `${color.percentage}%`, backgroundColor: color.hex }} /></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Alternatives */}
            {best_matches && best_matches.length > 1 && (
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs font-semibold text-gray-400 mb-3">Other Possibilities</p>
                    <ul className="space-y-2">
                        {best_matches.slice(1, 4).map((match) => (
                            <li key={match.color_id} className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-300">{match.name}</span>
                                <span className="text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                                    {Math.round(match.combined_score * 100)}%
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </motion.div>
    );
};

export default NewResultCard;
