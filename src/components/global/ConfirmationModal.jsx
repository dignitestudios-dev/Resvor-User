/* eslint-disable react/prop-types */

const ConfirmationModal = ({
  isOpen,
  title,
  description,
  confirmText = "Yes",
  cancelText = "No",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A150F80] px-4"
      onClick={() => {
        if (!loading && onCancel) {
          onCancel();
        }
      }}
      role="presentation"
    >
      <div
        className="w-[420px] max-w-full rounded-[16px] bg-white p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
        role="presentation"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="text-[28px] font-semibold text-[#181818]">
            {title}
          </h2>
          <p className="text-[16px] text-[#565656]">{description}</p>

          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              className="min-w-[140px] rounded-[12px] bg-[#21293514] px-8 py-3 text-[13px] font-bold text-[#212935] disabled:cursor-not-allowed disabled:opacity-60"
              onClick={onCancel}
              disabled={loading}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className="min-w-[140px] rounded-[12px] bg-[#EE3131] px-8 py-3 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "Please wait..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
