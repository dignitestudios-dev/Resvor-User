/* eslint-disable react/prop-types */

import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import { qrSnap, successCheck } from "../../assets/export";

const BuySubscriptionModal = ({ onClick, setCompleted, isVip }) => {
  const [showBill, setShowBill] = useState(false);
  const [success, setSuccess] = useState(false);

  return (
    <div className="fixed inset-0 bg-[#0A150F80] bg-opacity-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[440px]">
        <div
          className={`flex justify-between items-center  px-8 pt-4 ${
            !success ? "border-b-2 border-b-gray-300" : ""
          }`}
        >
          {!success ? (
            <p className=" xxl:text-[48px] text-[28px] text-[#181818] font-[600] capitalize">
              Add Card Details
            </p>
          ) : (
            <p></p>
          )}
          <div onClick={onClick} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>

        <div className="flex flex-col  lg:h-auto md:h-screen px-8 mb-4">
          {showBill ? (
            <>
              <div className="space-y-3 xxl:w-[400px] xxl:ml-12">
                <p className="text-[16px] text-[#181818] font-semibold mt-2">
                  Payment Method
                </p>
                <div className="p-4 bg-[#F1F1F1] rounded-xl">
                  <p className="text-[16px] text-[#181818] font-semibold mt-2">
                    Payment Summary
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-[16px] text-[#18181880] ">
                      Plan 1 (Gold)
                    </p>
                    <p className="text-[16px] text-[#4B4B4B] ">$15.99</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => {
                    setSuccess(true);
                    setCompleted(true);
                    setShowBill(false);
                  }}
                  className="bg-gradient-to-l from-[#012C57] to-[#061523] text-white text-[13px] font-bold px-4 py-3 rounded-[12px] w-[97%]"
                >
                  Pay Now
                </button>
              </div>
              <div className="my-4 flex justify-center">
                <button
                  onClick={() => setShowBill(false)}
                  className="bg-[#21293514] text-[13px] text-black px-4 py-3 rounded-[12px] w-[97%] font-bold"
                >
                  Back
                </button>
              </div>
            </>
          ) : success && isVip ? (
            <div className="flex flex-col justify-center items-center lg:h-auto md:h-screen mb-10">
              <div>
                <img src={qrSnap} alt="success" className="w-[120px]" />
              </div>
              <div className="mt-4 space-y-3 xxl:w-[400px] xxl:ml-12 text-center">
                <p className=" xxl:text-[48px] text-[32px] text-[#181818] font-[600] capitalize">
                  Your QR Code
                </p>
                <p className="xxl:text-[26px] text-[16px] text-[#565656] capitalize ">
                  Scan this QR code upon entering to get access to VIP lounge
                  features
                </p>
              </div>
              <div className="mt-4 flex justify-center w-[360px]">
                <button
                  onClick={""}
                  className="bg-gradient-to-l from-[#012C57] to-[#061523] text-white text-[13px] font-bold px-4 py-3 rounded-[12px] w-[97%]"
                >
                  Download QR Code
                </button>
              </div>
              <div className="my-4 flex justify-center w-[360px]">
                <button
                  onClick={onClick}
                  className="bg-white border-[1px] text-black border-[#000000] text-[13px] px-4 py-3 rounded-[12px] w-[97%] font-bold"
                >
                  Next
                </button>
              </div>
            </div>
          ) : success ? (
            <div className="flex flex-col justify-center items-center lg:h-auto md:h-screen mb-10">
              <div>
                <img src={successCheck} alt="success" className="w-[120px]" />
              </div>
              <div className="mt-4 space-y-3 xxl:w-[400px] xxl:ml-12 text-center">
                <p className=" xxl:text-[48px] text-[32px] text-[#181818] font-[600] capitalize">
                  Congratulations
                </p>
                <p className="xxl:text-[26px] text-[16px] text-[#565656] capitalize ">
                  You have successfully subscribed to Gold Plan.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 xxl:w-[400px] xxl:ml-12">
              <p className="text-[16px] text-[#181818] font-semibold mt-2">
                Add Payment Details
              </p>
              <div>
                <label className="block text-[14px] font-[500] text-[#737373] mb-2 mt-6">
                  Card Holder Name
                </label>
                <div className="px-1">
                  <input
                    placeholder="Enter card holder name here"
                    type="text"
                    id={"name"}
                    name={"name"}
                    maxLength={30}
                    value={""}
                    onChange={""}
                    className={`w-full px-4 py-2 text-sm rounded-[12px] bg-transparent ring-1 ring-[#BEBEBE] 
            focus:ring-2 focus:ring-gray-200 focus:outline-none pr-12 placeholder:font-light placeholder:text-[12px] placeholder:text-[#737373]`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[14px] font-[500] text-[#737373] mb-2 mt-6">
                  Card Number
                </label>
                <div className="px-1">
                  <input
                    placeholder="Enter card number here"
                    type="text"
                    id={"name"}
                    name={"name"}
                    maxLength={30}
                    value={""}
                    onChange={""}
                    className={`w-full px-4 py-2 text-sm rounded-[12px] bg-transparent ring-1 ring-[#BEBEBE] 
            focus:ring-2 focus:ring-gray-200 focus:outline-none pr-12 placeholder:font-light placeholder:text-[12px] placeholder:text-[#737373]`}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center border-b-2 border-b-gray-300 pb-3">
                <div>
                  <label className="block text-[14px] font-[500] text-[#737373] mb-2 mt-2">
                    Expiry
                  </label>
                  <div className="px-1">
                    <input
                      placeholder="mm/yy"
                      type="text"
                      id={"name"}
                      name={"name"}
                      maxLength={30}
                      value={""}
                      onChange={""}
                      className={`w-full px-4 py-2 text-sm rounded-[12px] bg-transparent ring-1 ring-[#BEBEBE] 
            focus:ring-2 focus:ring-gray-200 focus:outline-none pr-12 placeholder:font-light placeholder:text-[12px] placeholder:text-[#737373]`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[14px] font-[500] text-[#737373] mb-2 mt-2">
                    CVC
                  </label>
                  <div className="px-1">
                    <input
                      placeholder="0000"
                      type="text"
                      id={"name"}
                      name={"name"}
                      maxLength={30}
                      value={""}
                      onChange={""}
                      className={`w-full px-4 py-2 text-sm rounded-[12px] bg-transparent ring-1 ring-[#BEBEBE] 
            focus:ring-2 focus:ring-gray-200 focus:outline-none pr-12 placeholder:font-light placeholder:text-[12px] placeholder:text-[#737373]`}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setShowBill(true)}
                  className="bg-gradient-to-l from-[#012C57] to-[#061523] text-white text-[13px] font-bold px-4 py-3 rounded-[12px] w-[97%]"
                >
                  Add Card
                </button>
              </div>
              <div className="my-4 flex justify-center">
                <button
                  onClick={onClick}
                  className="bg-[#21293514] text-[13px] text-black px-4 py-3 rounded-[12px] w-[97%] font-bold"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuySubscriptionModal;
