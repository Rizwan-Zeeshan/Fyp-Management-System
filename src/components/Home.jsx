// src/components/Home.js
import React, { useState, useEffect } from "react";

export function Home() {
  const text = "FYP Project";
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);
  const [color, setColor] = useState("#ffffff");

  // Function to generate a random color for text
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let clr = "#";
    for (let i = 0; i < 6; i++) {
      clr += letters[Math.floor(Math.random() * 16)];
    }
    return clr;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (index === text.length) {
        setDisplayed("");
        setIndex(0);
        setColor(getRandomColor()); // change color after full cycle
      } else {
        setDisplayed((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }
    }, 50); // fast animation

    return () => clearInterval(interval);
  }, [index, text]);

  return (
    <div style={styles.container}>
      <h1 style={{ ...styles.text, color: color }}>{displayed}</h1>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    background: "linear-gradient(135deg, #ff7e5f, #feb47b, #86a8e7, #91eae4)", // colorful gradient
    backgroundSize: "400% 400%",
    animation: "gradientBG 15s ease infinite",
  },
  text: {
    fontSize: "70px",
    fontWeight: "bold",
    letterSpacing: "4px",
    transition: "color 0.3s ease-in-out",
    textShadow: "2px 2px 8px rgba(0,0,0,0.3)", // subtle shadow for readability
  },
};

// Add keyframes animation for gradient background
const styleSheet = document.styleSheets[0];
const keyframes =
`@keyframes gradientBG {
  0% {background-position: 0% 50%;}
  50% {background-position: 100% 50%;}
  100% {background-position: 0% 50%;}
}`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default Home;
