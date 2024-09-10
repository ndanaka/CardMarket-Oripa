import React from "react";

function AgreeButton({ name, addclass, onClick }) {
  return (
    <button
      className={`p-2 px-4 my-1 button-22 text-white ${addclass}`}
      onClick={onClick}
    >
      {name}
    </button>
  );
}

export default AgreeButton;
