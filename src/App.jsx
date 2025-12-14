
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

import Header from "./components/Header";
import Analysis from "./components/Analysis";
import ColorManager from "./components/ColorManager";
import ColorDetail from "./components/ColorDetail";
import TrainingWizard from "./components/TrainingWizard";

const MANAGER_PASS = "musa@agent";
const MANAGER_UNLOCK_KEY = "gl_manager_unlocked";

function App() {
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [view, setView] = useState("analyzer"); // 'analyzer' or 'manager'
  const [selectedColor, setSelectedColor] = useState(null);
  const [showTrainingWizard, setShowTrainingWizard] = useState(false);

  // Password-gate state
  const [showManagerPass, setShowManagerPass] = useState(false);
  const [managerPassInput, setManagerPassInput] = useState();
  const [showManagerPassText, setShowManagerPassText] = useState(false);
  const [managerPassError, setManagerPassError] = useState("");
  const [pendingView, setPendingView] = useState(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const isManagerUnlocked = () => {
    try {
      return localStorage.getItem(MANAGER_UNLOCK_KEY) === "1";
    } catch {
      return false;
    }
  };

  const unlockManager = () => {
    try {
      localStorage.setItem(MANAGER_UNLOCK_KEY, "1");
    } catch {
      // ignore
    }
  };

  // Guarded navigation: requires pass when going to manager
  const guardedSetView = useCallback(
    (nextView) => {
      // allow normal flow for analyzer / other views
      if (nextView !== "manager") {
        setView(nextView);
        return;
      }

      // already unlocked
      if (isManagerUnlocked()) {
        setView("manager");
        return;
      }

      // show password modal
      setPendingView("manager");
      setManagerPassInput("");
      setManagerPassError("");
      setShowManagerPass(true);
    },
    []
  );

  const handleManagerPassSubmit = (e) => {
    e?.preventDefault?.();

    if (managerPassInput.trim() === MANAGER_PASS) {
      unlockManager();
      setShowManagerPass(false);
      setManagerPassError("");
      setView(pendingView || "manager");
      setPendingView(null);
      return;
    }

    setManagerPassError("Wrong password. Try again.");
  };

  const handleManagerPassCancel = () => {
    setShowManagerPass(false);
    setManagerPassInput("");
    setManagerPassError("");
    setPendingView(null);
  };

  // When training is complete, hide wizard and refresh the manager view
  const handleTrainingComplete = () => {
    setShowTrainingWizard(false);
    // Force a re-render of the ColorManager component to fetch new data
    setView("");
    setTimeout(() => setView("manager"), 0);
  };

  const renderView = () => {
    if (view === "manager") {
      if (selectedColor) {
        return (
          <ColorDetail
            color={selectedColor}
            onBack={() => setSelectedColor(null)}
            setLoading={setLoading}
          />
        );
      }
      return (
        <ColorManager
          setSelectedColor={setSelectedColor}
          setShowTrainingWizard={setShowTrainingWizard}
        />
      );
    }
    // Default to analyzer view
    return (
      <div className="w-full space-y-8">
        <Analysis setLoading={setLoading} loading={loading} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 transition-colors duration-500 flex flex-col items-center relative overflow-x-hidden selection:bg-indigo-500/30">
      {/* Ambient Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden max-w-full">
        <div className="absolute top-[-10%] left-[-20%] w-[500px] h-[500px] rounded-full bg-purple-400/20 dark:bg-purple-900/20 blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-soft-light animate-blob" />
        <div className="absolute top-[10%] right-[-20%] w-[400px] h-[400px] rounded-full bg-blue-400/20 dark:bg-indigo-900/20 blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-soft-light animate-blob animation-delay-2000" />
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-sm"
          >
            <div className="flex space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-4 h-4 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                  animate={{ y: [-10, 0, -10] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
            <p className="mt-8 font-medium text-indigo-900 dark:text-indigo-200 tracking-wider uppercase text-sm">
              Processing...
            </p>
          </motion.div>
        )}

        {showTrainingWizard && (
          <TrainingWizard
            onComplete={handleTrainingComplete}
            onCancel={() => setShowTrainingWizard(false)}
            setLoading={setLoading}
          />
        )}

        {/* Manager Password Modal */}
        {showManagerPass && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-white/60 dark:bg-black/70 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.97, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 10 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-md rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-zinc-950/80 shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black tracking-tight">Manager Access</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      Enter password to open the Manager.
                    </p>
                  </div>
                  <button
                    onClick={handleManagerPassCancel}
                    className="rounded-xl px-3 py-2 text-sm font-bold bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleManagerPassSubmit} className="mt-5 space-y-3">
                  <div className="relative">
                  <input
                    autoFocus
                    type={showManagerPassText ? "text" : "password"}
                    value={managerPassInput}
                    onChange={(e) => {
                      setManagerPassInput(e.target.value);
                      if (managerPassError) setManagerPassError("");
                    }}
                    placeholder="Password"
                    className="w-full rounded-xl px-4 py-3 pr-12 bg-white/90 dark:bg-black/40 border border-black/10 dark:border-white/10 outline-none focus:ring-2 focus:ring-indigo-500/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowManagerPassText(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 hover:text-indigo-600 transition"
                    aria-label="Toggle password visibility"
                  >
                    {showManagerPassText ? "🙈" : "👁️"}
                  </button>
                </div>
                  

                  {managerPassError && (
                    <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                      {managerPassError}
                    </p>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 rounded-xl px-4 py-3 font-black bg-indigo-600 hover:bg-indigo-700 text-white transition"
                    >
                      Unlock
                    </button>
                    <button
                      type="button"
                      onClick={handleManagerPassCancel}
                      className="flex-1 rounded-xl px-4 py-3 font-black bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
                    >
                      Cancel
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 pt-1">
                    Tip: password is saved on this device after first unlock.
                  </p>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Container */}
      <div className="w-full max-w-6xl px-6 py-12 z-10 flex flex-col items-center">
        <Header
          view={view}
          setView={guardedSetView}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />

        <AnimatePresence mode="wait">
          <motion.main
            key={view + (selectedColor?.id || "")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {renderView()}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;

