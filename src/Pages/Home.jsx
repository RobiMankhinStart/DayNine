import React from "react";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start">
      {/* Header */}
      <header className="w-full bg-emerald-600 text-white p-6 shadow-md">
        <h1 className="text-3xl font-bold text-center">Welcome Home!</h1>
      </header>

      {/* Main content */}
      <main className="flex flex-col items-center mt-20 space-y-6">
        <p className="text-5xl text-gray-700">
          You are successfully logged in. Explore your dashboard or profile.
        </p>

        {/* Navigation buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
          >
            Register
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 transition"
          >
            Login
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
