/* eslint-disable react/prop-types */
// import { RiLoader5Line } from "react-icons/ri";

const Button = ({ text, onClick, type, disabled = false }) => {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className="flex-1 py-2 bg-gradient-to-l from-[#012C57] to-[#061523] text-white text-[13px] rounded-lg w-full"
    >
      {text}
    </button>
  );
};

export default Button;
