// Filename - Progress_bar.js

import React, { useState, useEffect } from "react";

const Progress_bar = ({ label, progress, height }) => {
  const [bgColor, setBgColor] = useState("");

  useEffect(() => {
    if (progress < 30) {
      setBgColor("#FF0800");
    } else if (progress < 60) setBgColor("#FF8C00");
    else setBgColor("#4CBB17");
  }, []);
  return (
    <div className="w-full">
      <div style={{ width: "100%", backgroundColor: "#e0e0e0" }}>
        <div
          style={{
            width: `${progress}%`,
            height: "20px",
            backgroundColor: `${bgColor}`,
          }}
        />
      </div>
      <p className="text-white">{label}</p>
    </div>
  );
};

export default Progress_bar;
