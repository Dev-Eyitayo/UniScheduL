import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-900 to-blue-700 text-white pb-24 pt-20">
        {/* Decorative background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <svg
            className="absolute top-0 left-0 opacity-50"
            width="800"
            height="600"
            fill="none"
            viewBox="0 0 800 600"
          >
            <circle cx="400" cy="300" r="400" fill="#2b6cb0" />
          </svg>
          <svg
            className="absolute bottom-0 right-0 opacity-30"
            width="500"
            height="500"
            fill="none"
            viewBox="0 0 500 500"
          >
            <circle cx="250" cy="250" r="250" fill="#3182ce" />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4 animate-fadeIn">
            UniScheduL
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 font-light animate-fadeIn delay-100">
            Revolutionize your university scheduling and research collaboration
            with an elegant, modern platform.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12 animate-fadeIn delay-200">
            <Link
              to="/login"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded shadow transition"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded shadow hover:bg-white hover:text-blue-700 transition"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Floating Card / Eye Candy */}
        <div className="relative max-w-4xl mx-auto h-64 sm:h-80 md:h-96 px-6">
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="w-full sm:w-3/4 md:w-2/3 bg-white rounded-lg shadow-2xl p-6 text-left transform hover:-translate-y-1 transition-all animate-fadeIn delay-300">
              <h3 className="text-2xl font-bold text-blue-800 mb-2">
                Simplify University Life
              </h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                UniScheduL unifies scheduling, room assignments, and research 
                collaboration across faculties, ensuring a smooth academic 
                experience for everyone.
              </p>
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition"
              >
                Explore Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative py-16 px-6 md:px-12 bg-white text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 animate-fadeInUp">
          Why UniScheduL?
        </h2>
        <p className="max-w-2xl mx-auto text-gray-500 mb-12 animate-fadeInUp delay-100">
          From class management to conflict resolution, see how our platform can 
          elevate your university's efficiency and academic excellence.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature Card 1 */}
          <div className="p-6 border rounded-lg shadow hover:shadow-lg transition animate-fadeInUp delay-200">
            <div className="mb-3 text-blue-600 flex justify-center">
              {/* Icon or image */}
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
              Comprehensive Scheduling
            </h3>
            <p className="text-gray-600 text-sm">
              Automate timetable creation for departments, faculty, 
              and students—eliminate overlap and room conflicts instantly.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="p-6 border rounded-lg shadow hover:shadow-lg transition animate-fadeInUp delay-300">
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
              Dynamic Research Management
            </h3>
            <p className="text-gray-600 text-sm">
              Collaborate seamlessly with peers, track progress, 
              and share insights in real time.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="p-6 border rounded-lg shadow hover:shadow-lg transition animate-fadeInUp delay-400">
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
              Our algorithm automatically detects course/room 
              collisions—saving time, money, and resources.
            </p>
          </div>
        </div>
      </section>

      {/* Parallax / CTA Section */}
      <section className="relative bg-fixed bg-center bg-cover bg-no-repeat py-20 text-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1585217089331-fd7c8f79a5ed?auto=format&w=1600&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative max-w-3xl mx-auto px-6 text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Simplify Your University?
          </h2>
          <p className="mb-8">
            Let UniScheduL handle the complexity so you can focus on quality education 
            and groundbreaking research.
          </p>
          <Link
            to="/login"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded font-semibold shadow transition"
          >
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between">
          <div className="mb-4 sm:mb-0">
            <h4 className="text-white font-bold text-xl">UniScheduL</h4>
            <p className="text-sm">© {new Date().getFullYear()} UniScheduL. All rights reserved.</p>
          </div>
          <div className="flex gap-4 items-center">
            <a href="#features" className="hover:text-white transition text-sm">Features</a>
            <Link to="/login" className="hover:text-white transition text-sm">Login</Link>
            <a href="https://github.com/edeniyanda" target="_blank" rel="noreferrer" className="hover:text-white transition text-sm">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
