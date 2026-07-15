/* eslint-disable react/prop-types */

import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { Check } from "lucide-react";
import Button from "../global/Button";

const ServicesModal = ({
  isOpen,
  onClose,
  setServiceModalData,
  loungeServices,
  initialSelectedServices,
}) => {
  const [selectedServices, setSelectedServices] = useState(
    initialSelectedServices || []
  );

  const handleDateData = () => {
    setServiceModalData(selectedServices);
    onClose();
  };

  const handleAddService = (service) => {
    setSelectedServices((prev) => [...prev, service]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-5">
      <div className="relative w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-8 py-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Services & Packages
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Enhance your lounge experience by adding premium services.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 transition hover:bg-gray-100"
          >
            <RxCross2 className="text-xl text-gray-700" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[68vh] overflow-y-auto p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {loungeServices?.map((item) => {
              const itemId = item.id || item._id;

              const isAdded = selectedServices.some(
                (service) => (service.id || service._id) === itemId
              );

              return (
                <div
                  key={itemId}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={
                        item.images?.[0]?.location ||
                        item.images?.[1]?.location ||
                        ""
                      }
                      alt={item.name}
                      className="h-56 w-full object-cover"
                    />

                    {/* Price Badge */}
                    <div className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-slate-900 shadow-lg">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format((item.price || 0) / 100)}
                    </div>

                    {/* Added Badge */}
                    {isAdded && (
                      <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-500 shadow-lg">
                        <Check size={20} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex h-[240px] flex-col justify-between p-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {item.name}
                      </h3>

                      <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-500">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-6">
                      <Button
                        text={isAdded ? "Added" : "Add to Booking"}
                        type="button"
                        disabled={isAdded}
                        onClick={() =>
                          !isAdded &&
                          handleAddService({
                            id: itemId,
                            _id: itemId,
                            title: item.name,
                            price: item.price,
                          })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-between border-t border-gray-200 bg-white px-8 py-5">
          <div>
            <p className="font-semibold text-slate-900">
              {selectedServices.length} Service
              {selectedServices.length !== 1 && "s"} Selected
            </p>

            <p className="text-sm text-gray-500">
              Continue when you're ready.
            </p>
          </div>

          <button
            onClick={handleDateData}
            className="rounded-xl bg-gradient-to-r from-[#012C57] to-[#0A5DB8] px-10 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesModal;