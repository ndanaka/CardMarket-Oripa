import React from "react";

function InputGroup({ label, type, name, value, placeholder, onChange, ...props }) {
  return (
    <div className="form-group my-2">
      <label className="font-Lexend p-1" htmlFor={props.name}>
        {label}
      </label>
      <input
        type={type}
        className="form-control form-control-sm text-gray-700"
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
