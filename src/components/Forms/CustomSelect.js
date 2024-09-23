import { useState } from "react";

const CustomSelect = ({ options, selectedOption, setOption }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    setOption(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full rounded-lg bg-white">
      <div
        className="p-3 border-[1px] cursor-pointer rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption ? (
          <div className="flex items-center">
            <img
              className="h-[30px] w-[30px]"
              src={selectedOption.img}
              alt={selectedOption.label}
            />
            <span className="ml-3 text-xl">{selectedOption.label}</span>
          </div>
        ) : (
          <span className="text-base text-lg">Select an option</span>
        )}
      </div>
      {isOpen && (
        <ul className="absolute w-full bg-white border-[1px] border-gray-200 p-0 m-0 cursor-pointer rounded-lg shadow-lg shadow-gray-50 z-10">
          {options.map((option) => (
            <li
              className="flex items-center px-3 p-2 border-b-[1px] border-gray-100 hover:bg-gray-100"
              key={option.value}
              onClick={() => handleSelect(option)}
            >
              <img className="h-[30px] w-[30px]" src={option.img} alt={option.label} />
              <span className="ml-3 text-xl">{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
