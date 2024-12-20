import React from "react";
import { useRouter } from "next/router";

const HomePage = () => {
  const router = useRouter();

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-black bg-opacity-75 relative"
      style={{
        backgroundImage: "url('../images/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="flex flex-col items-center justify-center p-6 rounded-lg shadow-lg max-w-md w-full"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.2)", // Transparent white
          backdropFilter: "blur(3px)", // Blur effect
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)", // Subtle shadow
          border: "1px solid rgba(255, 255, 255, 0.18)", // Border for added effect
        }}
      >
        <h1 className="text-2xl font-bold mb-4 text-white text-center">
          Hello, thanks for complying.
        </h1>
        <p className="text-gray-400 mb-6 text-center">
          Please leave your message and I'll get back to you.
        </p>
        <button
          onClick={() => router.push("/form")}
          className="bg-gray-200 text-gray-500 py-2 px-4 rounded-lg hover:bg-gray-400"
        >
          Leave a Message
        </button>
      </div>
    </div>
  );
};

export default HomePage;
