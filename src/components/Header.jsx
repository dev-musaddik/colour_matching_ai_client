import React from "react";

const Header = ({ view, setView, darkMode, toggleDarkMode }) => {
  const navLinkClasses = (targetView) =>
    `relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950
      ${
        view === targetView
          ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
          : "text-gray-700 dark:text-gray-200 hover:bg-gray-200/70 dark:hover:bg-gray-800/70"
      }
    `;

  return (
    <header className="relative w-full mb-12">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-10 -left-10 h-44 w-44 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -top-10 right-0 h-44 w-44 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute top-24 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="flex flex-col gap-4 rounded-3xl border border-gray-200/70 bg-white/70 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-gray-950/40 md:flex-row md:items-center md:justify-between md:p-6">
        {/* Left: brand */}
        <div className="flex items-start gap-4 md:items-center">
          {/* Logo badge fixes black logo on dark bg */}
          <div
            className={
              "relative flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm " +
              "border-gray-200/70 bg-white/95 " +
              "dark:border-white/10 dark:bg-white"
            }
            aria-label="GL Logo"
            title="GL Hair"
          >
            {/* If you ever add a white logo file, switch based on darkMode */}
            <img
              src={"/GL Colour Matching AI Agent logo.png"}
              alt="GL Logo"
              className="h-9 w-9 object-contain"
              draggable={false}
            />
            {/* Subtle ring */}
            <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5 dark:ring-black/10" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
                GL Hair Colour Analyzer
              </h1>
              <span className="inline-flex items-center rounded-full border border-indigo-200/80 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-500/10 dark:text-indigo-200">
                Pro Tool
              </span>
            </div>

            <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-300 sm:text-base">
              Professional pigment + style analysis with clean, consistent results.
            </p>

            {/* Tiny feature chips */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:bg-white/5 dark:text-gray-200">
                Accurate matching
              </span>
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:bg-white/5 dark:text-gray-200">
                Salon-ready output
              </span>
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:bg-white/5 dark:text-gray-200">
                Fast workflow
              </span>
            </div>
          </div>
        </div>

        {/* Right: controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:justify-end">
          <nav className="flex w-full items-center gap-1 rounded-2xl border border-gray-200/70 bg-gray-50/70 p-1 shadow-sm dark:border-white/10 dark:bg-gray-900/30 sm:w-auto">
            <button
              type="button"
              onClick={() => setView("analyzer")}
              className={navLinkClasses("analyzer")}
            >
              <span className="inline-flex items-center gap-2">
                <IconSpark /> Analyzer
              </span>
            </button>

            <button
              type="button"
              onClick={() => setView("manager")}
              className={navLinkClasses("manager")}
            >
              <span className="inline-flex items-center gap-2">
                <IconPalette /> Color Manager
              </span>
            </button>
          </nav>

          <button
            type="button"
            onClick={toggleDarkMode}
            className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200/70 bg-white/80 px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-white active:scale-[0.98] dark:border-white/10 dark:bg-gray-900/40 dark:text-gray-100 dark:hover:bg-gray-900/60"
            aria-label="Toggle dark mode"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gray-100 text-gray-700 transition-colors group-hover:bg-gray-200 dark:bg-white/10 dark:text-gray-100 dark:group-hover:bg-white/15">
              {darkMode ? <IconSun /> : <IconMoon />}
            </span>
            <span className="hidden sm:inline">
              {darkMode ? "Light mode" : "Dark mode"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

/* Icons */
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

const IconPalette = () => (
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

const IconSpark = () => (
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

export default Header;
