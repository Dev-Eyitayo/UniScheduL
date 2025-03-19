import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      {/* 
        We set the 'html' or 'body' to have overflow hidden to remove the vertical scrollbar.
        Make sure your content doesn't exceed screen height if you truly want no scrolling. 
      */}
      <style>
        {`
          html, body {
            overflow: hidden;
          }
        `}
      </style>

      <main className="relative h-screen w-full flex flex-col overflow-hidden font-sans">
        {/* Hero / Main banner */}
        <section className="relative flex-1 bg-gradient-to-br from-blue-600 to-blue-900 flex flex-col items-center justify-center text-center px-4">
          {/* Subtle circle shape overlays for visual flair */}
          <div className="absolute inset-0 overflow-hidden">
            <svg
              className="absolute top-[-20%] left-[-30%] w-[80rem] h-[80rem] text-blue-800 opacity-30"
              fill="currentColor"
            >
              <circle cx="50%" cy="50%" r="50%" />
            </svg>
            <svg
              className="absolute bottom-[-30%] right-[-20%] w-[60rem] h-[60rem] text-blue-700 opacity-20"
              fill="currentColor"
            >
              <circle cx="50%" cy="50%" r="50%" />
            </svg>
          </div>

          {/* Main Hero Content */}
          <div className="relative z-10">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white drop-shadow-lg mb-4 tracking-tight">
              UniScheduL
            </h1>
            <p className="text-lg sm:text-xl text-gray-100 max-w-2xl mx-auto font-light mb-6 px-2 sm:px-0 leading-relaxed">
              Revolutionize your university scheduling and research collaboration 
              with an elegant, modern platform.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/login"
                className="px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-medium drop-shadow-md transition"
              >
                Get Started
              </Link>
              <a
                href="#details"
                className="px-6 py-3 rounded-full bg-transparent border border-white text-white hover:bg-white hover:text-blue-700 font-medium drop-shadow-md transition"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Floating Card to highlight a key point */}
          <div className="relative mt-12 sm:mt-20 w-full max-w-lg mx-auto z-20">
            <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-2xl p-6 text-left 
                            transform hover:-translate-y-1 transition-all">
              <h3 className="text-2xl font-bold text-blue-800 mb-2">
                Simplify University Life
              </h3>
              <p className="text-gray-700 text-sm sm:text-base">
                UniScheduL unifies scheduling, room assignments, and research 
                collaboration across faculties, ensuring a smooth academic 
                experience for everyone.
              </p>
              <Link
                to="/dashboard"
                className="inline-block mt-4 bg-blue-600 text-white py-2 px-4 rounded-full font-medium 
                           hover:bg-blue-700 transition"
              >
                Explore Dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* Lower section / additional info */}
        <section
          id="details"
          className="bg-white w-full text-center flex-none py-12 px-6"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Why UniScheduL?
          </h2>
          <p className="max-w-xl mx-auto text-gray-600 mb-10">
            From effortless course management to automated conflict resolution, 
            our platform delivers a next-level academic experience.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Card 1 */}
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-lg transition">
              <div className="mb-3 text-blue-600 flex justify-center">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 7h18M3 12h18M3 17h18" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1 text-gray-800">
                Seamless Timetabling
              </h3>
              <p className="text-sm text-gray-600">
                Generate perfect schedules with zero overlap or confusion.
              </p>
            </div>
            {/* Card 2 */}
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-lg transition">
              <div className="mb-3 text-blue-600 flex justify-center">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1 text-gray-800">
                Conflict Resolution
              </h3>
              <p className="text-sm text-gray-600">
                Instantly detect and solve scheduling clashes, saving countless hours.
              </p>
            </div>
            {/* Card 3 */}
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-lg transition">
              <div className="mb-3 text-blue-600 flex justify-center">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 12l6-6m0 0l6 6m-6-6v12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1 text-gray-800">
                Research Collaboration
              </h3>
              <p className="text-sm text-gray-600">
                Work together seamlessly on projects and share key insights in real time.
              </p>
            </div>
          </div>
        </section>

        {/* Footer / CTA  */}
        <footer className="bg-gray-900 text-gray-400 flex-none py-6">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h4 className="text-white font-bold text-xl tracking-tight">
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
                href="https://github.com/xxx"
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
    </>
  );
}
