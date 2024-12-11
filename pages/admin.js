import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Import Firestore instance
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import { auth } from "../firebase"; // Import auth instance for authentication
import { signOut } from "firebase/auth"; // Import signOut to log the user out

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Redirect if user is not logged in
  useEffect(() => {
    if (!auth.currentUser) {
      router.push("/admin-login"); // Redirect to login if not authenticated
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
      setLoading(false); // Set loading to false once messages are fetched
    };
    fetchMessages();
  }, []);

  // Handle logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        router.push("/admin-login"); // Redirect to login page after logout
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  if (loading) {
    return <div>Loading...</div>; // Loading state while fetching data
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
              <li key={message.id} className="bg-gray-100 p-4 rounded-md shadow-sm">
                <h4 className="text-lg font-semibold">{message.name}</h4>
                <p className="text-sm text-gray-600">{message.email}</p>
                <p className="text-gray-800 mt-2">{message.message}</p>
                <button
                  className="bg-blue-500 text-white py-1 px-4 rounded-md mt-2"
                  onClick={() => alert("Replying to message")} // Implement reply functionality
                >
                  Reply
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-4 rounded-md mt-2 ml-2"
                  onClick={() => alert("Deleting message")} // Implement delete functionality
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
