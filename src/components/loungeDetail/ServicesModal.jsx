/* eslint-disable react/prop-types */

import { useState, useEffect, useCallback } from "react";
import { RxCross2 } from "react-icons/rx";
import { Check } from "lucide-react";
import Button from "../global/Button";
import ViewServiceModal, { getInitials, resolveImageUrl } from "./ViewServiceModal";

/* ─────────────────────────────────────────
   ServicesModal
───────────────────────────────────────── */
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
  const [detailService, setDetailService] = useState(null);

  // Reset detail view when modal closes
  useEffect(() => {
    if (!isOpen) setDetailService(null);
  }, [isOpen]);

  const handleDateData = () => {
    setServiceModalData(selectedServices);
    onClose();
  };

  const handleAddService = (service) => {
    setSelectedServices((prev) => [...prev, service]);
  };

  // Escape key: close detail first, then the modal
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        if (detailService) setDetailService(null);
        else onClose();
      }
    },
    [detailService, onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-5">
        <div className="relative w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col max-h-[90vh]">

          {/* Header */}
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-8 py-6 shrink-0">
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
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 transition hover:bg-gray-100 cursor-pointer"
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
                const imageUrl =
                  resolveImageUrl(item.images?.[0]) ||
                  resolveImageUrl(item.images?.[1]);
                const imageCount = item.images?.length || 0;

                return (
                  <div
                    key={itemId}
                    className="group h-full overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative shrink-0">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.name}
                          className="h-56 w-full object-cover"
                        />
                      ) : (
                        <div className="h-56 w-full bg-[#747691] flex items-center justify-center text-white text-4xl font-bold tracking-wider select-none">
                          {getInitials(item?.name)}
                        </div>
                      )}

                      {/* Price Badge */}
                      <div className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-slate-900 shadow-lg">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format((Number(item.price) || 0) / 100)}
                      </div>

                      {/* Image count badge */}
                      {imageCount > 1 && (
                        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                          +{imageCount - 1} photo{imageCount - 1 > 1 ? "s" : ""}
                        </div>
                      )}

                      {/* Added Badge */}
                      {isAdded && (
                        <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-500 shadow-lg">
                          <Check size={20} className="text-white" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-6 gap-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 truncate">
                          {item.name}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-500">
                          {item.description}
                        </p>
                      </div>

                      {/* Actions: View Detail + Add */}
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => setDetailService(item)}
                          className="flex-1 py-2.5 rounded-xl border border-[#0B0E52] text-[#0B0E52] text-[13px] font-semibold hover:bg-[#0B0E52] hover:text-white transition cursor-pointer"
                        >
                          View Detail
                        </button>
                        <div className="flex-1">
                          <Button
                            text={isAdded ? "Added ✓" : "Add"}
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
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 flex items-center justify-between border-t border-gray-200 bg-white px-8 py-5 shrink-0">
            <div>
              <p className="font-semibold text-slate-900">
                {selectedServices.length} Service
                {selectedServices.length !== 1 && "s"} Selected
              </p>
              <p className="text-sm text-gray-500">Continue when you're ready.</p>
            </div>
            <div className="w-[140px]">
              <Button
                text="Continue"
                type="button"
                onClick={() => handleDateData()}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Shared ViewServiceModal — renders above ServicesModal (z-[60]) */}
      {detailService && (
        <ViewServiceModal
          service={detailService}
          onClose={() => setDetailService(null)}
        />
      )}
    </>
  );
};

export default ServicesModal;