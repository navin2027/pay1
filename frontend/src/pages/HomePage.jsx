import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          Welcome to GPay Clone
        </h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
          >
            Signup
          </button>
        </div>
      </div>
    </>
  );
}

export default HomePage;
