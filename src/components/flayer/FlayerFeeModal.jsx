/* eslint-disable react/prop-types */

import { RxCross2 } from "react-icons/rx";

const FlayerFeeModal = ({ onClose, onClick }) => {
  return (
    <div className="fixed inset-0 bg-[#0A150F80] bg-opacity-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[440px] pb-2 overflow-y-auto ">
        <div
          className={`flex justify-between items-center  px-8 pt-4 border-b-2 border-b-gray-300`}
        >
          <h2 className="text-[28px] font-bold mb-4">Flyer Fee</h2>
          <div onClick={onClose} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>
        <div className="flex flex-col  lg:h-auto md:h-screen px-8 mb-4">
          <div className="space-y-3 xxl:w-[400px] xxl:ml-12">
            <p className="text-[16px] text-[#181818] font-semibold mt-2">
              Payment Method
            </p>
            <div className="p-4 bg-[#F1F1F1] rounded-xl">
              <p className="text-[16px] text-[#181818] font-semibold  pb-2 border-b border-b-gray-300">
                Payment Summary
              </p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-[14px] font-[500] text-[#18181880] ">
                  Booking
                </p>
                <p className="text-[16px] text-[#4B4B4B] ">$15.99</p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-[14px] font-[500] text-[#18181880] ">Tax</p>
                <p className="text-[16px] text-[#4B4B4B] ">$15.99</p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-[14px] font-[500] text-[#18181880] ">
                  Subtotal
                </p>
                <p className="text-[16px] text-[#4B4B4B] ">$15.99</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={onClick}
              className="bg-gradient-to-l from-[#012C57] to-[#061523] text-white text-[13px] font-bold px-4 py-3 rounded-[12px] w-[97%]"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlayerFeeModal;
