import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/router";
import { HiMicrophone, HiChat } from "react-icons/hi";

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [message, setMessage] = useState("");
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(""); // Track validation errors
  const router = useRouter();

  const handleNextStep = () => {
    if (!name || !whatsappNumber) {
      setError("All fields are required.");
      return;
    }
    setError(""); // Clear any previous errors
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!message) {
      setError("Message cannot be empty.");
      return;
    }

    setError("");
    try {
      await addDoc(collection(db, "messages"), {
        name,
        whatsappNumber,
        message,
        date: serverTimestamp(),
        status: "pending",
      });
      router.push("/outro?status=success");
    } catch (error) {
      router.push("/outro?status=failure");
    }
  };

  const handleMicrophoneClick = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage((prevMessage) => `${prevMessage} ${transcript}`);
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

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
        className="p-6 rounded-lg shadow-lg max-w-md w-full"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
        }}
      >
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">Step 1: Your Details</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-lg mb-4 bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="WhatsApp Number"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full p-2 border rounded-lg mb-4 bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleNextStep}
              className="bg-gray-200 text-gray-600 py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            >
              Next
            </button>
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">Step 2: Your Message</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="relative">
              <input
                type="text"
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full m-1 p-2 border rounded-lg pr-16 bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute right-2 top-2 flex items-center space-x-2">
                <button
                  className={`p-2 rounded-full ${
                    listening ? "bg-red-500" : "bg-gray-200"
                  }`}
                  onClick={handleMicrophoneClick}
                >
                  <HiMicrophone className="text-gray-600" />
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-gray-200 text-gray-600 p-2 rounded-full hover:bg-gray-400 transition"
                >
                  <HiChat />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;
