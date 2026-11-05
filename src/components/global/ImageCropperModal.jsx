/* eslint-disable react/prop-types */
import { useState, useRef, useEffect, useCallback } from "react";
import { RxCross2 } from "react-icons/rx";
import { FiCrop, FiSliders, FiZoomIn, FiZoomOut, FiRotateCcw } from "react-icons/fi";

const CROP_BOX_SIZE = 220; // Visual crop box size in UI (px)
const OUTPUT_SIZE = 500; // Required export resolution (px)

const ImageCropperModal = ({
  isOpen,
  imageSrc,
  originalFile,
  onClose,
  onCropComplete,
}) => {
  const [imageElement, setImageElement] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [previewUrl, setPreviewUrl] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const containerRef = useRef(null);
  const offscreenCanvasRef = useRef(null);

  // Initialize and load image when imageSrc changes
  useEffect(() => {
    if (!isOpen || !imageSrc) {
      setImageElement(null);
      setPreviewUrl("");
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImageElement(img);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    };
    img.src = imageSrc;
  }, [isOpen, imageSrc]);

  // Compute scale and bounds based on current zoom
  const getDisplayMetrics = useCallback(() => {
    if (!imageElement) return { baseScale: 1, displayedW: 0, displayedH: 0, maxOffsetX: 0, maxOffsetY: 0 };

    const naturalW = imageElement.naturalWidth || 1;
    const naturalH = imageElement.naturalHeight || 1;

    // Minimum scale so image at least covers the crop box
    const baseScale = Math.max(CROP_BOX_SIZE / naturalW, CROP_BOX_SIZE / naturalH);
    const displayedW = naturalW * baseScale * zoom;
    const displayedH = naturalH * baseScale * zoom;

    const maxOffsetX = Math.max(0, (displayedW - CROP_BOX_SIZE) / 2);
    const maxOffsetY = Math.max(0, (displayedH - CROP_BOX_SIZE) / 2);

    return { baseScale, displayedW, displayedH, maxOffsetX, maxOffsetY };
  }, [imageElement, zoom]);

  // Clamp crop position within bounds
  const getClampedCrop = useCallback(
    (offset) => {
      const { maxOffsetX, maxOffsetY } = getDisplayMetrics();
      return {
        x: Math.max(-maxOffsetX, Math.min(maxOffsetX, offset.x)),
        y: Math.max(-maxOffsetY, Math.min(maxOffsetY, offset.y)),
      };
    },
    [getDisplayMetrics]
  );

  // Render 500x500 crop to offscreen canvas and update live preview
  useEffect(() => {
    if (!imageElement) return;

    const naturalW = imageElement.naturalWidth;
    const naturalH = imageElement.naturalHeight;
    const { baseScale } = getDisplayMetrics();
    const clamped = getClampedCrop(crop);

    const canvas = offscreenCanvasRef.current || document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    offscreenCanvasRef.current = canvas;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Source window in natural image coordinates
    const sourceCropSize = CROP_BOX_SIZE / (baseScale * zoom);
    const sourceCenterX = naturalW / 2 - clamped.x / (baseScale * zoom);
    const sourceCenterY = naturalH / 2 - clamped.y / (baseScale * zoom);

    const sx = Math.max(0, Math.min(naturalW - sourceCropSize, sourceCenterX - sourceCropSize / 2));
    const sy = Math.max(0, Math.min(naturalH - sourceCropSize, sourceCenterY - sourceCropSize / 2));

    ctx.drawImage(
      imageElement,
      sx,
      sy,
      sourceCropSize,
      sourceCropSize,
      0,
      0,
      OUTPUT_SIZE,
      OUTPUT_SIZE
    );

    try {
      const dataUrl = canvas.toDataURL("image/png");
      setPreviewUrl(dataUrl);
    } catch (e) {
      console.warn("Live preview data URL error:", e);
    }
  }, [imageElement, zoom, crop, getDisplayMetrics, getClampedCrop]);

  // Drag interaction handlers
  const handlePointerDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - crop.x, y: e.clientY - crop.y });
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const newCrop = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    };
    setCrop(getClampedCrop(newCrop));
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    }
  };

  // Wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.0015;
    setZoom((prev) => {
      const next = Math.min(3, Math.max(1, prev + delta));
      return Number(next.toFixed(2));
    });
  };

  const handleZoomChange = (e) => {
    const nextZoom = parseFloat(e.target.value);
    setZoom(nextZoom);
    setCrop((prev) => getClampedCrop(prev));
  };

  const handleReset = () => {
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  // Final export at 500x500px resolution
  const handleSaveCrop = () => {
    const canvas = offscreenCanvasRef.current;
    if (!canvas || !imageElement) return;

    setIsExporting(true);
    const mimeType = originalFile?.type || "image/png";
    const filename = originalFile?.name
      ? originalFile.name.replace(/\.[^/.]+$/, "") + "-cropped.png"
      : "profile-picture-cropped.png";

    canvas.toBlob(
      (blob) => {
        setIsExporting(false);
        if (!blob) return;

        const croppedFile = new File([blob], filename, {
          type: mimeType === "image/webp" ? "image/webp" : "image/png",
          lastModified: Date.now(),
        });

        const finalPreview = URL.createObjectURL(croppedFile);
        onCropComplete(croppedFile, finalPreview);
        onClose();
      },
      mimeType === "image/webp" ? "image/webp" : "image/png",
      0.95
    );
  };

  if (!isOpen || !imageSrc) return null;

  const clamped = getClampedCrop(crop);
  const { baseScale } = getDisplayMetrics();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-[560px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-[#0B0E52]">
                <FiCrop size={18} />
              </div>
              <h2 className="text-[19px] font-bold text-gray-900">
                Crop Profile Picture
              </h2>
            </div>
            <p className="text-[12.5px] text-gray-500 mt-1">
              Drag to center your face in the square area. Use zoom to frame it properly.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition cursor-pointer"
          >
            <RxCross2 size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Crop Container with Letterbox overlay */}
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
            className="relative w-full h-[260px] bg-[#0A0D14] rounded-xl overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none shadow-inner"
          >
            {/* The Image */}
            {imageElement && (
              <img
                src={imageSrc}
                alt="Source to crop"
                draggable={false}
                style={{
                  width: `${imageElement.naturalWidth * baseScale * zoom}px`,
                  height: `${imageElement.naturalHeight * baseScale * zoom}px`,
                  transform: `translate(${clamped.x}px, ${clamped.y}px)`,
                  maxWidth: "none",
                  maxHeight: "none",
                }}
                className="pointer-events-none select-none transition-none will-change-transform"
              />
            )}

            {/* Dark Mask with Clear Square Cutout */}
            <div
              style={{
                width: `${CROP_BOX_SIZE}px`,
                height: `${CROP_BOX_SIZE}px`,
                boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.7)",
              }}
              className="absolute pointer-events-none z-10 border-2 border-white/90"
            >
              {/* 3x3 Grid Lines (rule of thirds) */}
              <div className="w-full h-full grid grid-cols-3 grid-rows-3 pointer-events-none">
                <div className="border-r border-b border-white/30" />
                <div className="border-r border-b border-white/30" />
                <div className="border-b border-white/30" />
                <div className="border-r border-b border-white/30" />
                <div className="border-r border-b border-white/30" />
                <div className="border-b border-white/30" />
                <div className="border-r border-white/30" />
                <div className="border-r border-white/30" />
                <div />
              </div>
            </div>
          </div>

          {/* Zoom & Frame Controls */}
          <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
              <div className="flex items-center gap-1.5 text-gray-800">
                <FiSliders size={14} className="text-[#0B0E52]" />
                <span>Zoom & Frame</span>
              </div>
              <span className="text-gray-500 font-mono">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setZoom((prev) => Math.max(1, +(prev - 0.1).toFixed(2)))}
                className="text-gray-400 hover:text-gray-700 transition p-1 cursor-pointer"
                title="Zoom Out"
              >
                <FiZoomOut size={16} />
              </button>

              <input
                type="range"
                min="1"
                max="3"
                step="0.01"
                value={zoom}
                onChange={handleZoomChange}
                className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0B0E52]"
              />

              <button
                type="button"
                onClick={() => setZoom((prev) => Math.min(3, +(prev + 0.1).toFixed(2)))}
                className="text-gray-400 hover:text-gray-700 transition p-1 cursor-pointer"
                title="Zoom In"
              >
                <FiZoomIn size={16} />
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 text-[11.5px] font-medium text-gray-500 hover:text-[#0B0E52] px-2 py-1 rounded hover:bg-white transition cursor-pointer border border-transparent hover:border-gray-200"
              >
                <FiRotateCcw size={12} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Live Preview Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                LIVE PREVIEW
              </span>
              <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200">
                Output: {OUTPUT_SIZE} × {OUTPUT_SIZE} px
              </span>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/40 flex justify-around items-center">
              {/* Circular Avatar Preview */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-200 flex items-center justify-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Circular avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">Loading…</span>
                  )}
                </div>
                <span className="text-[11.5px] text-gray-600 font-medium mt-2">
                  Circular Avatar
                </span>
              </div>

              {/* Square (1:1) Preview */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white shadow-md bg-gray-200 flex items-center justify-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Square 1:1 preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">Loading…</span>
                  )}
                </div>
                <span className="text-[11.5px] text-gray-600 font-medium mt-2">
                  Square (1:1)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-white">
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveCrop}
            disabled={!imageElement || isExporting}
            className="px-5 py-2.5 rounded-xl bg-[#0B0E52] text-sm font-semibold text-white hover:opacity-90 transition flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
          >
            <FiCrop size={16} />
            <span>{isExporting ? "Processing…" : "Save & Crop"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;

