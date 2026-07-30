/* eslint-disable react/prop-types */

import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import Button from "../global/Button";
import { useAuthMe } from "../../hooks/queries/useQueries";
import axios from "../../axios";
import { ErrorToast, SuccessToast } from "../global/Toaster";
import { clearStoredAuthSession } from "../../lib/authSession";
import { useQueryClient } from "@tanstack/react-query";

const DeleteAccountModal = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { data: authData } = useAuthMe();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    const user = authData?.data?.user || authData?.data;
    const userId = user?._id || user?.id;

    if (!userId) {
      ErrorToast("User ID not found. Please try again.");
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`/users/${userId}`);
      queryClient.setQueryData(["auth-me"], null);
      clearStoredAuthSession();
      SuccessToast("Account deleted successfully");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Delete account error:", error);
      ErrorToast(
        error.response?.data?.message ||
        "Failed to delete account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0A150F80] z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[490px] max-w-[95%] pb-4 overflow-y-auto">
        <div className="flex justify-between items-center px-8 pt-4 ">
          <div></div>
          <div onClick={onClose} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full pt-4 px-8 text-center">
          <h2 className="text-[36px] font-semibold ">Delete Account</h2>
          <p className="text-[16px] text-[#212121] font-[500]">
            Are you sure you want to delete your account?
          </p>
          <p className="text-[#565656] text-[14px]">
            Your active subscription will be cancelled immediately on deletion.
          </p>
          <p className="text-[#565656] text-[14px]">
            Your data will be removed from our database permanently.
          </p>
          <div className="my-8 mx-20">
            <Button
              text={loading ? "Deleting..." : "Delete Account"}
              type="button"
              onClick={handleDelete}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;

