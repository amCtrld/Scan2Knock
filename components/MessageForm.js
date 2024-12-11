import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import the CardioLoader
const CardioLoader = dynamic(() => import("./CardioLoader"), { ssr: false });

const MessageForm = () => {
  const [isLoading, setIsLoading] = useState(true); // State for loading screen
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 5000); // 5 seconds delay
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setStatus("Please fill in all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "messages"), {
        name,
        email,
        message,
        date: serverTimestamp(),
        status: "pending",
      });
      setIsSubmitted(true);
      setStatus("Message sent successfully!");
    } catch (error) {
      setStatus("Error sending message. Please try again.");
    }
  };

  // Animation variants
  const slideIn = (direction) => ({
    hidden: {
      x: direction === "left" ? -100 : direction === "right" ? 100 : 0,
      y: direction === "bottom" ? 100 : direction === "top" ? -100 : 0,
      opacity: 0,
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <h1 className="text-xl font-semibold mb-4">Hi there, stand by...</h1>
        <CardioLoader />
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold animate-typing">Message sent. Bye bye!</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg space-y-6 max-w-md w-full"
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={slideIn("left")}>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </motion.div>

        <motion.div variants={slideIn("right")}>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            required
          />
        </motion.div>

        <motion.div variants={slideIn("bottom")}>
          <label htmlFor="message" className="block text-sm font-semibold text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
            rows="5"
            required
          ></textarea>
        </motion.div>

        <motion.button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
          variants={slideIn("top")}
        >
          Submit
        </motion.button>

        {status && <p className="text-center text-red-500">{status}</p>}
      </motion.form>
    </div>
  );
};

export default MessageForm;
