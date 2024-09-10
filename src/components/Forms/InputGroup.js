import React from "react";
console.log("inputgroup");
function InputGroup({ label, type, name, value, placeholder, onChange }) {
  return (
    <div class="form-group my-2">
      <label className="font-Lexend p-1" for="firstname">
        {label}
      </label>
      <input
        type={type}
        class="form-control form-control-sm text-gray-700"
        name={name}
        value={value}
        aria-describedby="helpId"
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
}

export default InputGroup;
