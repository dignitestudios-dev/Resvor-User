/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { FiUploadCloud } from "react-icons/fi";
import { ErrorToast } from "../global/Toaster";

const ALLOWED_EXTENSIONS = ["jpeg", "jpg", "png"];
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const AddCustomFlyerModal = ({ isOpen, onClose, onAdd }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  useEffect(() => {
    if (!isOpen) {
      handleRemoveFile();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isOpen) return null;

  const validateAndSetFile = (file) => {
    if (!file) return;

    const extension = file.name?.split(".").pop()?.toLowerCase();
    const isValidType =
      ALLOWED_MIME_TYPES.includes(file.type) ||
      ALLOWED_EXTENSIONS.includes(extension);

    if (!isValidType) {
      ErrorToast("Only .jpeg, .jpg, and .png images are allowed.");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file);
  };



  const handleAdd = () => {
    if (!selectedFile) {
      ErrorToast("Please select an image file first.");
      return;
    }
    onAdd(selectedFile);
  };

  return (
    <div className="fixed inset-0 bg-[#0A150F80] z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[16px] w-[500px] max-w-full overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-5 pb-4 border-b border-gray-200">
          <h2 className="text-[22px] font-bold text-[#181818]">Add Custom Flyer</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition cursor-pointer"
          >
            <RxCross2 className="text-[24px]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".jpeg,.jpg,.png,image/jpeg,image/jpg,image/png"
            className="hidden"
          />

          {!previewUrl ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-[14px] p-8 flex flex-col items-center justify-center text-center cursor-pointer transition ${isDragging
                  ? "border-[#012C57] bg-blue-50/50"
                  : "border-gray-300 hover:border-gray-400 bg-gray-50/50"
                }`}
            >
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-[#012C57] mb-3">
                <FiUploadCloud className="text-2xl" />
              </div>
              <p className="text-[15px] font-semibold text-gray-800 mb-1">
                Drag and drop your flyer image here
              </p>
              <p className="text-[13px] text-gray-500 mb-3">
                or <span className="text-[#012C57] underline font-medium">browse from your computer</span>
              </p>
              <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                Supported formats: .jpeg, .jpg, .png
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative border border-gray-200 rounded-[14px] overflow-hidden bg-gray-100 flex items-center justify-center max-h-[300px]">
                <img
                  src={previewUrl}
                  alt="Custom Flyer Preview"
                  className="max-h-[300px] w-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between px-1">
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {selectedFile?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile?.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-semibold text-[#012C57] bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!selectedFile}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-l from-[#012C57] to-[#061523] text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomFlyerModal;
