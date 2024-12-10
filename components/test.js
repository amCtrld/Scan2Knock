import { useEffect } from "react";
import { db } from "../firebase"; // Ensure this path is correct
import { collection, addDoc } from "firebase/firestore";

const Test = () => {
  useEffect(() => {
    const testFirestore = async () => {
      try {
        const docRef = await addDoc(collection(db, "testCollection"), {
          name: "Test User",
          message: "Hello, Firestore!",
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    };

    testFirestore();
  }, []);

  return <div>Testing Firestore...</div>;
};

export default Test;
