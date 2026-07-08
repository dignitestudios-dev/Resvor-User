/* eslint-disable react/prop-types */
import { RiLoader5Line } from "react-icons/ri";

const AuthButton = ({ text, onClick, loading, type, disabled }) => {
  return (
    <button
      disabled={disabled || loading}
      type={type}
      onClick={onClick}
      className={`w-full py-3 bg-white text-black text-sm font-[700] rounded-[12px] hover:opacity-90 transition ${(disabled || loading) ? "opacity-50 cursor-not-allowed" : ""
        }`}
    >
      <div className="flex justify-center items-center">
        <span className="mr-1">{text}</span>
        {loading && <RiLoader5Line className="animate-spin text-lg" />}
      </div>
    </button>
  );
};

export default AuthButton;
