import React, { useEffect } from "react";

export default function CardioLoader() {
  useEffect(() => {
    // Dynamically import ldrs when on the client
    import("ldrs").then((module) => module.cardio.register());
  }, []);

  return (
    <l-cardio
      size="50"
      stroke="4"
      speed="2"
      color="blue"
    ></l-cardio>
  );
}
