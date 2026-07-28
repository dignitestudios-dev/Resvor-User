/* eslint-disable react/prop-types */
import { useFormik } from "formik";
import * as Yup from "yup";
import { RxCross2 } from "react-icons/rx";
import Button from "../global/Button";

const disputeSchema = Yup.object({
  reason: Yup.string()
    .required("Reason for dispute is required.")
    .min(5, "Reason must be at least 5 characters.")
    .max(500, "Reason cannot exceed 500 characters.")
    .test(
      "not-empty-after-trim",
      "Reason cannot be empty or only spaces.",
      (value) => value?.trim().length > 0
    )
    .test(
      "no-leading-space",
      "Reason cannot start with a space.",
      (value) => (value ? !value.startsWith(" ") : true)
    )
    .test(
      "no-multiple-spaces",
      "Reason cannot contain multiple consecutive spaces.",
      (value) => (value ? !/ {2,}/.test(value) : true)
    )
    .test(
      "no-html",
      "HTML or script content is not allowed.",
      (value) => (value ? !/<[^>]*>|<\/[^>]*>/g.test(value) : true)
    ),
});

const DisputeModal = ({ isOpen, onClose, onSubmit, loading = false }) => {
  const formik = useFormik({
    initialValues: {
      reason: "",
    },
    validationSchema: disputeSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      if (onSubmit) {
        await onSubmit({ reason: values.reason.trim() });
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A150F80] p-4"
      onClick={() => {
        if (!loading && onClose) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        className="w-full max-w-[440px] rounded-[16px] bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="presentation"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-[24px] font-bold text-[#181818]">File a Dispute</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer text-gray-500 hover:text-gray-800 disabled:opacity-50"
          >
            <RxCross2 className="text-[24px]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[14px] font-medium text-[#181818] mb-1.5">
              Reason for Dispute <span className="text-red-500">*</span>
            </label>
            <textarea
              name="reason"
              rows={4}
              value={formik.values.reason}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="e.g. The venue was closed when we arrived."
              maxLength={250}
              disabled={loading}
              className={`w-full rounded-[12px] border p-3 text-sm text-[#181818] outline-none transition placeholder:text-gray-400 placeholder:text-[13px] ${formik.touched.reason && formik.errors.reason
                ? "border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-gray-300 focus:border-indigo-900 focus:ring-1 focus:ring-indigo-900"
                }`}
            />
            {formik.touched.reason && formik.errors.reason && (
              <p className="mt-1 text-[12px] text-red-600">
                {formik.errors.reason}
              </p>
            )}
            <p className="mt-1 text-right text-[11px] text-gray-400">
              {formik.values.reason.length}/250
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-[10px] bg-gray-100 py-2.5 text-[14px] font-semibold text-gray-700 hover:bg-gray-200 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <div className="flex-1">
              <Button
                type="submit"
                text={loading ? "Submitting..." : "Submit Dispute"}
                disabled={loading}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DisputeModal;
