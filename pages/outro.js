import React from "react";
import { useRouter } from "next/router";

const Outro = () => {
  const router = useRouter();
  const { status } = router.query;

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-black bg-opacity-75 relative"
      style={{
        backgroundImage: "url('../images/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col items-center justify-center p-6 rounded-lg shadow-lg max-w-md w-full"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.2)", // Transparent white
          backdropFilter: "blur(3px)", // Blur effect
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)", // Subtle shadow
          border: "1px solid rgba(255, 255, 255, 0.18)", // Border for added effect
        }}>
        {status === "success" ? (
          <h2 className="text-xl font-bold text-gray-400 mb-4">
            Your message has been sent successfully. Goodbye.
          </h2>
        ) : (
          <h2 className="text-xl font-bold text-red-600 mb-4">
            Message not sent. Try that again.
          </h2>
        )}
      </div>
    </div>
  );
};

export default Outro;
