/* eslint-disable react/prop-types */

import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import Button from "../global/Button";
import { servicesData } from "../../static/MockData";

const ServicesModal = ({ isOpen, onClose, setServiceModalData }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const handleDateData = () => {
    setServiceModalData(selectedServices);
    onClose();
  };

  const handleAddService = (service) => {
    setSelectedServices((prev) => [...prev, service]); // allow multiple
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-h-[680px] w-[915px] p-10 relative">
        <button
          type="button"
          className="absolute top-5 right-6"
          onClick={onClose}
        >
          <RxCross2 className="w-5 h-5 text-gray-700" />
        </button>

        <h2 className="text-[28px] font-bold mb-4">Services and Packages</h2>

        <div className="max-h-[500px] overflow-auto scrollbar-custom  ">
          {/* (e) => handleDobChange("month", e.target.value) */}
          <div className="space-y-4 text-[#6B6B6B]">
            <div className="grid grid-cols-3 gap-2">
              {servicesData?.map((item) => {
                const isAdded = selectedServices.some((s) => s.id === item.id);
                return (
                  <div
                    key={item.id}
                    className="rounded-[16px] p-3 bg-[#f6f5f5] relative"
                  >
                    <div>
                      <img
                        src={item.img}
                        className="rounded-[12px] w-full"
                        alt={item.title}
                      />
                    </div>

                    <div className="my-2">
                      <p className="text-[16px] text-blue-950 font-[600]">
                        {item.title}
                      </p>

                      <p className="leading-relaxed text-[15px] font-[500]">
                        Includes :
                      </p>

                      <ul className="list-disc text-[15px] font-[500] list-inside h-[100px]">
                        {item.includes.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="my-2">
                      <p className="text-indigo-950 text-[20px] font-[700]">
                        Price: ${item.price}
                      </p>
                    </div>

                    <div className="w-full flex justify-center ">
                      <div className="w-28">
                        <Button
                          text={isAdded ? "Added" : "Add to Booking"}
                          type="button"
                          disabled={isAdded}
                          onClick={() =>
                            !isAdded &&
                            handleAddService({
                              id: item.id,
                              title: item.title,
                              price: item.price,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex justify-center ">
            <button
              onClick={handleDateData}
              className="bg-gradient-to-l from-[#012C57] to-[#061523] text-white text-[13px] px-4 py-3 rounded-[12px] w-[350px]"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesModal;
