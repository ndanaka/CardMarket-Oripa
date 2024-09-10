import React from "react";

function SubHeader({ text }) {
  return (
    <div className="w-full py-2">
      <div className="text-center text-xl text-slate-600">{text}</div>
      <hr className="w-full my-2"></hr>
    </div>
  );
}

export default SubHeader;
