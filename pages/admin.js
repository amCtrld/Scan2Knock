import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/router";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import emailjs from "emailjs-com";

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null); // Track selected message
  const [isReplying, setIsReplying] = useState(false); // Track reply modal state
  const [reply, setReply] = useState(""); // Track reply content
  const router = useRouter();

  // Redirect if user is not logged in
  useEffect(() => {
    if (!auth.currentUser) {
      router.push("/admin-login");
    }
  }, [router]);

  // Fetch messages from Firestore
  useEffect(() => {
    const fetchMessages = async () => {
      const querySnapshot = await getDocs(collection(db, "messages"));
      const fetchedMessages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
      setLoading(false);
    };
    fetchMessages();
  }, []);

  // Handle logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => router.push("/admin-login"))
      .catch((error) => console.error("Error logging out:", error));
  };

  // Handle delete message
  const handleDeleteMessage = async (messageId) => {
    const messageRef = doc(db, "messages", messageId);
    await deleteDoc(messageRef);
    setMessages(messages.filter((msg) => msg.id !== messageId));
  };

  // Send Reply via EmailJS
  const handleSendReply = () => {
    const emailData = {
      to_name: selectedMessage.name, // Client's name
      reply: reply,                  // The reply message
      to_email: selectedMessage.email, // Client's email address
    };
  
    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        emailData,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        alert("Reply sent successfully!");
        setIsReplying(false); // Close the modal
        setReply(""); // Reset the reply input
      })
      .catch((error) => {
        console.error("Error sending reply:", error);
        alert("Failed to send reply. Please try again.");
      });
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md mt-4">
        <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded-md mb-6"
        >
          Logout
        </button>
        <div>
          <h3 className="text-lg font-semibold mb-4">Submitted Messages</h3>
          <ul className="space-y-4">
            {messages.map((message) => (
              <li
                key={message.id}
                className="bg-gray-100 p-4 rounded-md shadow-sm cursor-pointer"
                onClick={() => setSelectedMessage(message)}
              >
                <h4 className="text-lg font-semibold">{message.name}</h4>
                <p className="text-sm text-gray-600">
                  {message.message.slice(0, 50)}{" "}
                  {message.message.length > 50 && "..."}
                </p>

                {selectedMessage?.id === message.id && (
                  <div className="mt-4 space-y-2">
                    <p className="text-gray-800">{message.message}</p>
                    <div className="flex space-x-4">
                      <button
                        className="bg-blue-500 text-white py-1 px-4 rounded-md"
                        onClick={() => setIsReplying(true)} // Open reply modal
                      >
                        Reply
                      </button>
                      <button
                        className="bg-red-500 text-white py-1 px-4 rounded-md"
                        onClick={() => handleDeleteMessage(message.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Reply Modal */}
      {isReplying && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Reply to {selectedMessage.name}</h3>
            <textarea
              className="w-full p-2 border rounded-md focus:outline-none"
              rows="5"
              placeholder="Type your reply here..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            ></textarea>
            <div className="flex justify-end mt-4 space-x-4">
              <button
                className="bg-gray-500 text-white py-1 px-4 rounded-md"
                onClick={() => setIsReplying(false)} // Close the modal
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-1 px-4 rounded-md"
                onClick={handleSendReply}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
