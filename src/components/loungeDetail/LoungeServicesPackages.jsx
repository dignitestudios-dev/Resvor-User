import { useState } from "react";
import Button from "../global/Button";
import ViewServiceModal, { getInitials, resolveImageUrl } from "./ViewServiceModal";

/* ─────────────────────────────────────────
   LoungeServicesPackages
───────────────────────────────────────── */
const LoungeServicesPackages = ({ lounge }) => {
  const [selectedService, setSelectedService] = useState(null);

  if (!lounge) {
    return <p>Loading services...</p>;
  }

  const services = lounge?.services || [];

  if (!services.length) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-950">
          Services and Packages
        </h2>
        <div className="py-12 text-center rounded-xl bg-gray-50 border border-dashed border-gray-300">
          <p className="text-gray-500 font-medium">No services available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-[#6B6B6B]">
      <h2 className="text-2xl font-bold text-blue-950">
        Services and Packages
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => {
          const coverUrl = resolveImageUrl(service?.images?.[0]);
          const imageCount = service?.images?.length || 0;

          return (
            <div
              key={service._id}
              className="rounded-[16px] p-3 bg-[#f6f5f5] flex flex-col"
            >
              {/* Cover image */}
              <div className="relative">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    className="rounded-[12px] w-full h-[200px] object-cover"
                    alt={service?.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                    }}
                  />
                ) : (
                  <div className="rounded-[12px] w-full h-[200px] bg-[#747691] flex items-center justify-center text-white text-4xl font-bold tracking-wider select-none">
                    {getInitials(service?.name)}
                  </div>
                )}

                {/* Image count badge */}
                {imageCount > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    +{imageCount - 1} more
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="my-2 flex-1">
                <p className="text-[16px] text-blue-950 font-[600] break-all">
                  {service?.name}
                </p>
                <p className="leading-relaxed text-[13px] font-[400] mt-1 text-[#6B6B6B] line-clamp-2 [overflow-wrap:anywhere]">
                  {service?.description}
                </p>
              </div>

              {/* Price */}
              <div className="my-1">
                <p className="text-indigo-950 text-[18px] font-[700]">
                  Price: ${(Number(service?.price) / 100).toFixed(2)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setSelectedService(service)}
                  className="flex-1 py-2.5 rounded-[10px] border border-[#0B0E52] text-[#0B0E52] text-[13px] font-semibold hover:bg-[#0B0E52] hover:text-white transition cursor-pointer"
                >
                  View Detail
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Shared Detail Modal */}
      {selectedService && (
        <ViewServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
};

export default LoungeServicesPackages;