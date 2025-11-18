import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { flyer } from "../../assets/export";
import { flyerData } from "../../static/MockData";

const Flyers = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex items-center pt-[16px] pb-[18em] homeSectionImage">
        <div className="flex items-center justify-start w-full px-5 lg:px-40 gap-3">
          <div className="flex gap-1">
            <button type="button" onClick={() => navigate(-1)}>
              <FaArrowLeftLong color="white" size={20} />
            </button>
            <h2 className="text-white text-[30px] mt-0 font-bold leading-[48px] capitalize">
              Guestbook
            </h2>
          </div>
        </div>
      </div>
      <div className="px-5 lg:px-40">
        <div
          className=" mx-auto  bg-white rounded-xl -mt-[16em]"
          style={{ boxShadow: "0px 4px 30px 0px #00000026" }}
        >
          <div className="grid grid-cols-5 p-4 gap-4">
            {flyerData.map((item) => (
              <div
                onClick={() => navigate("/app/create-flyer")}
                key={item}
                className="space-y-2 cursor-pointer"
              >
                <div className="border border-[#F4F4F4] rounded-[10px] ">
                  <img src={flyer} alt="flyer" className="h-[273px]" />
                </div>
                <p className="text-[#202224] text-center text-[16px] font-[600]">
                  Flyer Name
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Flyers;
