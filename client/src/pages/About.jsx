import React from "react";

export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 px-6">
      <div className="max-w-2xl bg-white shadow-md rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-semibold text-blue-600 mb-3">
          About the Developer
        </h1>
        <p className="text-gray-700 leading-relaxed">
          Hi, I’m Giorgi — a passionate developer who enjoys building clean,
          functional, and user-friendly web apps. This project was created as a
          simple yet powerful tool to manage your daily tasks.
        </p>
        <p className="text-gray-500 mt-6">
          Tech Stack: <span className="font-medium text-blue-500">React</span>,{" "}
          <span className="font-medium text-blue-500">Node.js</span>,{" "}
          <span className="font-medium text-blue-500">Express</span>, and{" "}
          <span className="font-medium text-blue-500">MongoDB</span>.
        </p>
      </div>
    </div>
  );
}
