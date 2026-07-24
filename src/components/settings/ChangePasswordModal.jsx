/* eslint-disable react/prop-types */

import { RxCross2 } from "react-icons/rx";
import Button from "../global/Button";
import InputField from "../auth/InputField";
import { useFormik } from "formik";
import { changPasswordValues } from "../../init/app/appValues";
import { changePasswordSchema } from "../../schema/app/appSchema";
import { useChangePassword } from "../../hooks/mutations/OnboardingMutations";
import { SuccessToast, ErrorToast } from "../global/Toaster";

const ChangePasswordModal = ({ onClose }) => {
  const { mutate: changePasswordMutate, isPending } = useChangePassword();

  const { values, handleBlur, handleChange, errors, touched, handleSubmit } =
    useFormik({
      initialValues: changPasswordValues,
      validationSchema: changePasswordSchema,
      onSubmit: async (values) => {
        const payload = {
          password: values.password,
          newPassword: values.newPassword,
          role: "user"
        };
        changePasswordMutate(payload, {
          onSuccess: (res) => {
            SuccessToast(res?.message || "Password changed successfully.");
            onClose();
          },
          onError: (err) => {
            ErrorToast(
              err?.response?.data?.message ||
              err?.message ||
              "Failed to change password."
            );
          },
        });
      },
    });

  return (
    <div className="fixed inset-0 bg-[#0A150F80] z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[490px] max-w-[95%] pb-4 overflow-y-auto">
        <div className="flex justify-end items-center px-8 pt-4 ">
          <div onClick={onClose} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6 w-full pt-4 px-16">
            <div className="py-2 space-y-2 text-center">
              <h2 className="text-[36px] font-semibold mb-4 capitalize">
                change password
              </h2>
              <p className="text-[#565656] text-[16px]">
                You must enter current password in order to update password.
              </p>
            </div>
            <InputField
              label="Current Password"
              placeholder="Current password"
              showToggle
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              touched={touched.password}
              maxLength={50}
            />
            <InputField
              label="New Password"
              placeholder="Enter password"
              showToggle
              id="newPassword"
              name="newPassword"
              value={values.newPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.newPassword}
              touched={touched.newPassword}
              maxLength={50}
            />

            <InputField
              label="Confirm Password"
              placeholder="Re-enter password"
              showToggle
              id="confirmPassword"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
              maxLength={50}
            />
          </div>

          <div className="mt-8 mx-16 pb-4">
            <Button
              text={isPending ? "Updating..." : "Update"}
              type="submit"
              disabled={isPending}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
