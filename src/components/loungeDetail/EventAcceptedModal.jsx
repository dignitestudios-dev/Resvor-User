/* eslint-disable react/prop-types */

import { successCheck } from "../../assets/export";

const EventAcceptedModal = ({ onClick, onClose }) => {
  return (
    <div className="fixed inset-0 bg-[#0A150F80] bg-opacity-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-[26px] shadow-md p-8 w-[515px]  ">
        <div className="flex justify-end items-center pb-2 " onClick={onClose}>
          <span className="cursor-pointer rounded-sm p-[2px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 font-light text-gray-800 "
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
            <img src={successCheck} alt="success" className="w-[110px]" />
          </div>
          <div className="mt-4 mx-6 space-y-3 xxl:w-[400px] xxl:ml-12 text-center">
            <p className=" xxl:text-[48px] text-[32px] text-[#181818] font-[600] capitalize">
              Request Accepted!
            </p>
            <p className="xxl:text-[26px] text-[16px] text-[#565656] capitalize ">
              Your event request has been accepted at Highbar Roooftop - NYC.
              We’ve reserved your spot and selected services — now it’s time to
              lock it in. To confirm your reservation, please proceed with
              payment.
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 w-full px-14">
            <button
              onClick={onClick}
              className="flex-1 py-3 bg-gradient-to-l from-[#012C57] to-[#061523] text-white text-[13px] font-semibold rounded-lg w-full"
            >
              Proceed Now
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-[#21293514] rounded-lg text-gray-700 text-[13px] font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAcceptedModal;
