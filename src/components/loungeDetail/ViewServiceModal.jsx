/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import { RxCross2 } from "react-icons/rx";

/* ─────────────────────────────────────────
   Helpers (shared)
───────────────────────────────────────── */
export const getInitials = (name) => {
  if (!name) return "";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.trim().slice(0, 2).toUpperCase();
};

export const resolveImageUrl = (img) =>
  img?.location || img?.url || img?.src || null;

/* ─────────────────────────────────────────
   ViewServiceModal
───────────────────────────────────────── */
const ViewServiceModal = ({ service, onClose }) => {
  const images = service?.images || [];
  const [selectedUrl, setSelectedUrl] = useState("");

  useEffect(() => {
    if (images.length) {
      setSelectedUrl(resolveImageUrl(images[0]) || "");
    } else {
      setSelectedUrl("");
    }
  }, [service]);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  if (!service) return null;

  const formattedPrice =
    service?.price != null
      ? `$${(Number(service.price) / 100).toFixed(2)}`
      : "N/A";

  const formattedDate = service?.createdAt
    ? new Date(service.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <h2 className="text-xl font-bold text-slate-900 truncate pr-4">
            {service.name}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition text-gray-500 cursor-pointer shrink-0"
          >
            <RxCross2 size={22} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1">

          {/* Image Gallery */}
          <div className="p-6 pb-0">
            {/* Main Image */}
            <div className="w-full h-64 md:h-72 overflow-hidden rounded-2xl border bg-slate-100 shadow-sm flex items-center justify-center">
              {selectedUrl ? (
                <img
                  src={selectedUrl}
                  alt={service.name}
                  className="h-full w-full object-contain transition duration-300"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "";
                  }}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-[#747691] text-white text-5xl font-bold tracking-wider select-none rounded-2xl">
                  {getInitials(service.name)}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-4 flex gap-2.5 flex-wrap">
                {images.map((img, index) => {
                  const url = resolveImageUrl(img);
                  const isSelected = selectedUrl === url;
                  return (
                    <button
                      key={img._id || index}
                      type="button"
                      onClick={() => setSelectedUrl(url)}
                      className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all bg-slate-50 flex items-center justify-center p-0.5 cursor-pointer ${
                        isSelected
                          ? "border-indigo-600 ring-2 ring-indigo-200"
                          : "border-gray-200 hover:border-indigo-400"
                      }`}
                    >
                      <img
                        src={url}
                        alt={img.filename || `img-${index}`}
                        className="h-full w-full object-contain rounded-lg"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Price + Meta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {/* Price */}
            <div className="rounded-2xl p-5 bg-slate-50 border flex flex-col justify-center">
              <p className="text-xs uppercase font-semibold tracking-wider text-gray-500 mb-1">
                Price
              </p>
              <h3 className="text-3xl font-bold text-slate-800">
                {formattedPrice}
              </h3>
            </div>

            {/* Meta Details */}
            <div className="grid grid-cols-1 gap-3">
              {service.category && (
                <div className="rounded-xl border bg-white p-4">
                  <p className="text-xs uppercase text-gray-500">Category</p>
                  <p className="mt-1 font-semibold text-slate-800 break-words">
                    {service.category}
                  </p>
                </div>
              )}
              {service.duration && (
                <div className="rounded-xl border bg-white p-4">
                  <p className="text-xs uppercase text-gray-500">Duration</p>
                  <p className="mt-1 font-semibold text-slate-800 break-words">
                    {service.duration}
                  </p>
                </div>
              )}
              <div className="rounded-xl border bg-white p-4">
                <p className="text-xs uppercase text-gray-500">Created At</p>
                <p className="mt-1 font-semibold text-slate-800">
                  {formattedDate}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t bg-slate-50 px-6 py-6">
            <h3 className="mb-3 text-lg font-semibold text-slate-900">
              Description
            </h3>
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="whitespace-pre-wrap break-words leading-relaxed text-slate-600 text-sm">
                {service.description || "No description available."}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ViewServiceModal;
