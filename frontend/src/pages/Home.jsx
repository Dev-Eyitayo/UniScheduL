import React, { useRef } from "react";
import { Link } from "react-router-dom";

// Example advanced landing page
export default function Home() {
  // We'll reference the 'featuresRef' to scroll smoothly
  const featuresRef = useRef(null);

  const handleScrollDown = () => {
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="overflow-x-hidden font-sans">
      {/* 
        1) HERO SECTION 
      */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-600 to-blue-900">
        {/* Decorative layered circles for a high-end vibe */}
        <div className="absolute inset-0 overflow-hidden">
          <svg
            className="absolute top-[-20%] left-[-40%] w-[80rem] h-[80rem] text-blue-700 opacity-30"
            fill="currentColor"
          >
            <circle cx="50%" cy="50%" r="50%" />
          </svg>
          <svg
            className="absolute bottom-[-25%] right-[-25%] w-[60rem] h-[60rem] text-blue-800 opacity-20"
            fill="currentColor"
          >
            <circle cx="50%" cy="50%" r="50%" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg mb-4">
            UniScheduL
          </h1>
          <p className="text-lg md:text-xl text-gray-100 font-light max-w-2xl mx-auto mb-8 leading-relaxed">
            Revolutionize your university scheduling and research collaboration 
            with a sleek, modern platform—designed to enhance every detail of 
            the academic experience.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full 
                         font-medium shadow-lg transition"
            >
              Get Started
            </Link>
            <a
              href="#learn-more"
              className="border border-white text-white hover:text-blue-700 hover:bg-white 
                         px-6 py-3 rounded-full font-medium shadow-lg transition"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Scroll down button */}
        <div
          onClick={handleScrollDown}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 cursor-pointer group"
        >
          <div className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-white text-white hover:bg-white hover:text-blue-700 transition">
            {/* Arrow Down Icon */}
            <svg
              className="w-5 h-5 animate-bounce group-hover:animate-none transition"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 5v14m0 0l-5-5m5 5l5-5" />
            </svg>
          </div>
        </div>
      </section>

      {/* 
        2) FEATURES / NEXT SECTION 
      */}
      <section
        id="learn-more"
        ref={featuresRef}
        className="bg-white pt-16 pb-20 px-6 md:px-12 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Why UniScheduL?
        </h2>
        <p className="max-w-2xl mx-auto text-gray-600 mb-10">
          Discover an unparalleled scheduling tool—resolving conflicts, 
          unifying rooms and lecturers, and driving collaboration 
          across every faculty.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Feature Card 1 */}
          <div className="p-6 bg-gray-50 rounded-lg shadow hover:shadow-lg transition">
            <div className="mb-3 text-blue-600 flex justify-center">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M3 7h18M3 12h18M3 17h18" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Sleek Timetabling
            </h3>
            <p className="text-gray-600 text-sm">
              Generate conflict-free schedules with effortless drag-and-drop 
              convenience.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="p-6 bg-gray-50 rounded-lg shadow hover:shadow-lg transition">
            <div className="mb-3 text-blue-600 flex justify-center">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Smart Conflict Resolution
            </h3>
            <p className="text-gray-600 text-sm">
              Our intelligent system instantly flags and resolves 
              overlapping classes or labs.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="p-6 bg-gray-50 rounded-lg shadow hover:shadow-lg transition">
            <div className="mb-3 text-blue-600 flex justify-center">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M8 12l6-6m0 0l6 6m-6-6v12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Collaborative Research
            </h3>
            <p className="text-gray-600 text-sm">
              Manage projects, track progress, and share breakthroughs campus-wide.
            </p>
          </div>
        </div>
      </section>

      {/* 
        3) CTA / FOOTER 
      */}
      <section className="bg-blue-50 py-12 px-6 text-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">
          Ready for Tomorrow’s University?
        </h2>
        <p className="text-gray-700 mb-6 max-w-xl mx-auto">
          Join UniScheduL and elevate your academic operations to a new standard 
          of excellence.
        </p>
        <Link
          to="/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white 
                     px-6 py-3 rounded-full font-medium shadow transition"
        >
          Create an Account
        </Link>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h4 className="text-white font-bold text-xl">
              UniScheduL
            </h4>
            <p className="text-sm">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
          <div className="flex gap-4 text-sm">
            <a href="#features" className="hover:text-white transition">
              Features
            </a>
            <Link to="/dashboard" className="hover:text-white transition">
              Dashboard
            </Link>
            <a
              href="https://github.com/edeniyanda"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
