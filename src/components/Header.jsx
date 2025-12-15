import React from "react";

/**
 * A responsive and theme‑aware header component.
 *
 * This component adapts its colours and backgrounds based on the
 * `darkMode` prop. It remains fully responsive across screen sizes
 * and retains the general layout and functionality you provided,
 * including the tabbed navigation and theme toggle button.
 *
 * Props:
 * - view: "analyzer" | "manager"
 * - setView: Function to update the active view
 * - darkMode: boolean indicating whether dark theme is active
 * - toggleDarkMode: Function to flip between dark and light themes
 */
const Header = ({ view, setView, darkMode, toggleDarkMode }) => {
  /*
   * Base styles for the tabs. These remain constant regardless
   * of theme or active state. Additional classes for active and
   * inactive states are appended below.
   */
  const tabBase =
    "group relative flex-1 inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white/40";

  // Theme specific styles for active tabs. When darkMode is true the original
  // gradient colours are preserved; when false (light theme) the hues are
  // adjusted to stay legible and vibrant on a light background.
  const tabActiveAnalyzer = darkMode
    ? "bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-[0_12px_30px_-18px_rgba(99,102,241,0.9)]"
    : "bg-gradient-to-r from-blue-500 to-indigo-400 text-white shadow-[0_12px_30px_-18px_rgba(59,130,246,0.9)]";
  const tabActiveManager = darkMode
    ? "bg-gradient-to-r from-cyan-400 to-sky-500 text-white shadow-[0_12px_30px_-18px_rgba(34,211,238,0.9)]"
    : "bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-[0_12px_30px_-18px_rgba(16,185,129,0.9)]";
  const tabInactive = darkMode
    ? "bg-white/5 text-white/85 hover:bg-white/8 hover:text-white"
    : "bg-black/5 text-black/85 hover:bg-black/10 hover:text-black";

  // Wrapper styles for the card. In dark mode we use translucent dark
  // backgrounds and subtle white borders; in light mode the palette is
  // inverted with light backgrounds and darker borders.
  const cardWrapperClass = darkMode
    ? "rounded-[28px] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-3 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.7)] backdrop-blur-xl"
    : "rounded-[28px] border border-black/10 bg-gradient-to-b from-gray-100 to-white p-3 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.1)] backdrop-blur-xl";

  // Styles for the segmented navigation wrapper. Adjusts the border and
  // background colours according to the theme.
  const navWrapperClass = darkMode
    ? "mt-2 rounded-[22px] border border-white/10 bg-black/20 p-2"
    : "mt-2 rounded-[22px] border border-black/10 bg-gray-200 p-2";

  return (
    <header className="relative w-full mb-10">
      {/* Background glow / decorative shapes. These are largely
          unaffected by the theme because they sit behind the card and
          use translucent colours. */}
      <div className="pointer-events-none absolute inset-x-0 -top-20 -z-10 h-72">
        <div className="absolute left-1/2 top-0 h-72 w-[32rem] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute right-[-4rem] top-14 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute left-[-4rem] top-14 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div
        className=" relative
    w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] px-3

    md:w-auto
    md:left-0
    md:right-0
    md:ml-0
    md:mr-0
    md:px-0"
      >
        <div className={cardWrapperClass}>
          {/* Top row with logo and theme toggle */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              {/* Logo tile */}
              <div
                className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white shadow-sm"
                aria-label="GL Logo"
                title="GL Hair"
              >
                <img
                  src={"/GL Colour Matching AI Agent logo.png"}
                  alt="GL Logo"
                  className="h-9 w-9 object-contain"
                  draggable={false}
                />
                <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/10" />
              </div>

              <div className="min-w-0 flex items-center">
                <div className="flex flex-wrap items-center gap-2">
                  <h1
                    className={`truncate text-[22px] font-black tracking-tight ${
                      darkMode ? "text-white" : "text-black"
                    } sm:text-2xl`}
                  >
                    Hair Ai Agent
                  </h1>
                  <span
                    className={`group inline-flex items-center gap-2 rounded-full
    px-4 py-1.5
    text-[11px] font-bold uppercase tracking-[0.18em]
    border backdrop-blur
    shadow-md transition-all duration-300
    ${
      darkMode
        ? "border-white/25 bg-gradient-to-r from-indigo-400/20 via-purple-400/20 to-pink-400/20 text-white hover:shadow-lg hover:scale-[1.05] hover:ring-1 hover:ring-white/30"
        : "border-black/15 bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 text-black hover:shadow-lg hover:scale-[1.05] hover:ring-1 hover:ring-black/20"
    }
  `}
                  >
                    {/* Animated glowing dot */}
                    <span className="relative flex h-2 w-2">
                      <span
                        className={`absolute inline-flex h-full w-full rounded-full animate-ping
        ${darkMode ? "bg-emerald-400 opacity-75" : "bg-emerald-500 opacity-60"}
      `}
                      />
                      <span
                        className={`relative inline-flex h-2 w-2 rounded-full
        ${
          darkMode
            ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
            : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
        }
      `}
                      />
                    </span>
                    Pro Tool
                  </span>
                </div>
              </div>
            </div>

            {/* Theme toggle: a round button that flips between sun/moon icons */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl border text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-white/30 justify-center items-center ${
                darkMode
                  ? "border-white/10 bg-white/5 text-white/85 hover:bg-white/10 hover:text-white"
                  : "border-black/10 bg-gray-100 text-black/85 hover:bg-gray-200 hover:text-black"
              }`}
              aria-label="Toggle theme"
              title={darkMode ? "Switch to light" : "Switch to dark"}
            >
              {darkMode ? <IconSun /> : <IconMoon />}
            </button>
          </div>

          {/* Bottom segmented nav */}
          <div className={navWrapperClass}>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setView("analyzer")}
                className={`${tabBase} ${
                  view === "analyzer" ? tabActiveAnalyzer : tabInactive
                }`}
              >
                <IconAnalyzer />
                <span>Analyzer</span>
              </button>

              <button
                type="button"
                onClick={() => setView("manager")}
                className={`${tabBase} ${
                  view === "manager" ? tabActiveManager : tabInactive
                }`}
              >
                <IconManager />
                <span>Color Manager</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

/*
 * Icons
 *
 * These remain unchanged from your original implementation. They
 * intentionally render without any fill so that their colour is
 * inherited from the surrounding text colour. This ensures they
 * automatically adapt when the darkMode prop flips the text colour.
 */
const IconSun = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const IconMoon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const IconAnalyzer = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2a7 7 0 0 0-4 12c1 1 1 2 1 2h6s0-1 1-2a7 7 0 0 0-4-12Z" />
  </svg>
);

const IconManager = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 22a10 10 0 1 1 10-10c0 1.9-1.6 3-3.5 3H16a2 2 0 0 0-2 2c0 1.1.9 2 2 2" />
    <circle cx="7.5" cy="10.5" r=".5" />
    <circle cx="12" cy="8" r=".5" />
    <circle cx="16.5" cy="10.5" r=".5" />
    <circle cx="9" cy="15" r=".5" />
  </svg>
);

export default Header;
