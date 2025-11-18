/* eslint-disable react/prop-types */
import { dangerBlue } from "../../assets/export";

const ProceedFlayerModal = ({ onClick, onClose }) => {
  return (
    <div className="fixed inset-0 bg-[#0A150F80] bg-opacity-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[480px] py-8  overflow-y-auto">
        <div className="flex flex-col justify-center items-center lg:h-auto md:h-screen">
          <div>
            <img src={dangerBlue} alt="success" className="w-[110px]" />
          </div>
          <div className="mt-4 mx-6 space-y-3 xxl:w-[400px] xxl:ml-12 text-center">
            <p className=" xxl:text-[48px] text-[32px] text-[#181818] font-[600] capitalize">
              One-Time Payment to Send Invitation Flyer
            </p>
            <p className="xxl:text-[26px] text-[16px] text-[#565656] capitalize ">
              You’ve selected a stylish event flyer template to invite your
              friends via email. A small one-time fee helps cover platform
              branding, flyer design, and email delivery.
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

export default ProceedFlayerModal;
