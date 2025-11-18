import { loungeImg } from "../../assets/export";
import Button from "../global/Button";

const LoungeServicesPackages = () => {
  return (
    <div className="space-y-4 text-[#6B6B6B]">
      <h2 className="text-2xl font-bold text-blue-950">
        Services and Packages
      </h2>
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-[16px] p-3 bg-[#f6f5f5] relative">
          <div>
            <img
              src={loungeImg}
              className="rounded-[12px] w-full"
              alt="Venue Logo"
            />
          </div>
          <div className="my-2">
            <p className="text-[16px] text-blue-950 font-[600]">VIP Table</p>
            <p className="leading-relaxed text-[15px] font-[500]">
              Includes :{" "}
            </p>
            <ul className="list-disc text-[15px] font-[500] list-inside">
              <li>Lorem ipsum dolor sit amet.</li>
              <li>Lorem ipsum dolor sit amet.</li>
              <li>Lorem ipsum dolor sit amet.</li>
              <li>Lorem ipsum dolor sit amet.</li>
            </ul>
          </div>
          <div className="my-2">
            <p className="text-indigo-950 text-[20px] font-[700]">
              Price: $400
            </p>
          </div>
          <div className="w-full flex justify-center ">
            <div className="w-28 ">
              <Button text="Add to Booking" type="button" />
            </div>
          </div>
        </div>
        <div className="rounded-[16px] p-3 bg-[#f6f5f5] relative">
          <div>
            <img
              src={loungeImg}
              className="rounded-[12px] w-full"
              alt="Venue Logo"
            />
          </div>
          <div className="my-2">
            <p className="text-[16px] text-blue-950 font-[600]">VIP Table</p>
            <p className="leading-relaxed text-[15px] font-[500]">
              Includes :{" "}
            </p>
            <ul className="list-disc text-[15px] font-[500] list-inside">
              <li>Lorem ipsum dolor sit amet.</li>
              <li>Lorem ipsum dolor sit amet.</li>
              <li>Lorem ipsum dolor sit amet.</li>
              <li>Lorem ipsum dolor sit amet.</li>
            </ul>
          </div>
          <div className="my-2">
            <p className="text-indigo-950 text-[20px] font-[700]">
              Price: $400
            </p>
          </div>
          <div className="w-full flex justify-center ">
            <div className="w-28 ">
              <Button text="Add to Booking" type="button" />
            </div>
          </div>
        </div>
        <div className="rounded-[16px] p-3 bg-[#f6f5f5] relative">
          <div>
            <img
              src={loungeImg}
              className="rounded-[12px] w-full"
              alt="Venue Logo"
            />
          </div>
          <div className="my-2">
            <p className="text-[16px] text-blue-950 font-[600]">VIP Table</p>
            <p className="leading-relaxed text-[15px] font-[500]">
              Includes :{" "}
            </p>
            <ul className="list-disc text-[15px] font-[500] list-inside">
              <li>Lorem ipsum dolor sit amet.</li>
              <li>Lorem ipsum dolor sit amet.</li>
              <li>Lorem ipsum dolor sit amet.</li>
              <li>Lorem ipsum dolor sit amet.</li>
            </ul>
          </div>
          <div className="my-2">
            <p className="text-indigo-950 text-[20px] font-[700]">
              Price: $400
            </p>
          </div>
          <div className="w-full flex justify-center ">
            <div className="w-28 ">
              <Button text="Add to Booking" type="button" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoungeServicesPackages;
