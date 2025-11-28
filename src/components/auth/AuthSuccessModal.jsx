/* eslint-disable react/prop-types */
// import { SmallTick } from "../../../../assets/export";
import { successCheck } from "../../assets/export";

const AuthSuccessModal = ({ onClick, title, description }) => {
  return (
    <div className="fixed -inset-6 bg-[#0A150F80] bg-opacity-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] shadow-md p-8 w-[515px] h-[340px] ">
        <div className="flex justify-end items-center pb-2 " onClick={onClick}>
          <span className="cursor-pointer rounded-sm p-[2px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 font-light text-gray-400 "
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10 3.636 5.05A1 1 0 015.05 3.636L10 8.586z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>

        <div className="flex flex-col justify-center items-center lg:h-auto md:h-screen">
          <div>
            <img src={successCheck} alt="success" className="w-[120px]" />
          </div>
          <div className="mt-4 space-y-3 xxl:w-[400px] xxl:ml-12 text-center">
            <p className=" xxl:text-[48px] text-[32px] text-[#181818] font-[600] capitalize">
              {title}
            </p>
            <p className="xxl:text-[26px] text-[16px] text-[#565656] capitalize ">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSuccessModal;
