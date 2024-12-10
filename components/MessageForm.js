import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const MessageForm = () => {
  const [isLoading, setIsLoading] = useState(true); // State for loading screen
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 5000); // 5 seconds delay
    return () => clearTimeout(timer); // Cleanup timer on unmount
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

  // Loading screen
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold animate-pulse">Hello there!</h1>
      </div>
    );
  }

  // Confirmation screen after form submission
  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold animate-typing">Message sent. Bye bye!</h1>
        </div>
      </div>
    );
  }

  // Form component
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <form
        onSubmit={handleSubmit}
        className="bg-black p-8 rounded-lg shadow-2xl shadow-black w-96 space-y-4"
      >
        <h1 className="text-2xl text-gray-400 font-bold text-center">Leave a Message</h1>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-black p-2 border-b focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-black p-2 border-b focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-black p-2 border-b focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows="5"
          required
        />
        <button
          type="submit"
          className="w-full bg-white text-black py-2 hover:bg-gray-500 rounded-full transition-colors"
        >
          Submit
        </button>
        {status && <p className="text-center text-red-500">{status}</p>}
      </form>
    </div>
  );
};

export default MessageForm;
