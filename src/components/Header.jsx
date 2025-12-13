import React from 'react';

const Header = ({ view, setView, darkMode, toggleDarkMode }) => {
    const navLinkClasses = (targetView) => 
        `px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
            view === targetView 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`;

    return (
        <header className="w-full flex flex-col md:flex-row justify-between items-start mb-16">
            <div className="mb-8 md:mb-0 flex items-center gap-4">
                <img
                    src="/GL Colour Matching AI Agent logo.png"
                    alt="GL Logo"
                    className="w-12 h-12 object-contain"
                />
                <div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-purple-400 pb-2">
                        GL Hair Color Analyzer
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg font-medium">
                        Professional Pigment & Style Analysis
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <nav className="flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <button onClick={() => setView('analyzer')} className={navLinkClasses('analyzer')}>
                        Analyzer
                    </button>
                    <button onClick={() => setView('manager')} className={navLinkClasses('manager')}>
                        Color Manager
                    </button>
                </nav>
                <button
                    onClick={toggleDarkMode}
                    className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors active:scale-95"
                >
                    {darkMode ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                        </svg>
                    )}
                </button>
            </div>
        </header>
    );
};

export default Header;
