/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  experiencePreferences,
  loungePreferences,
  musicPreferences,
} from "../../static/PreferenceCategories";
import AuthButton from "../auth/AuthButton";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useFormik } from "formik";
import { preferencesSchema } from "../../schema/onBoarding/onBoardSchema";
import { preferencesValues } from "../../init/onBoarding/onBoardValues";
import { usePreferences } from "../../hooks/mutations/OnboardingMutations";
import { ErrorToast } from "../global/Toaster";
import Cookies from "js-cookie";
import { setStoredTokenType } from "../../lib/authSession";
import { useQueryClient } from "@tanstack/react-query";

const Preferences = ({ handleNext, handlePrevious }) => {
  const preferencesMutation = usePreferences();
  const queryClient = useQueryClient();

  // 👇 3 separate states instead of one shared activeCategories
  const [activeMusicGenres, setActiveMusicGenres] = useState([]);
  const [activeLoungeTypes, setActiveLoungeTypes] = useState([]);
  const [activeExperiences, setActiveExperiences] = useState([]);

  // 👇 reusable toggle that updates both local state and formik field
  const toggleItem = (item, activeList, setActiveList, fieldName) => {
    const updated = activeList.includes(item)
      ? activeList.filter((i) => i !== item)
      : [...activeList, item];
    setActiveList(updated);
    setFieldValue(fieldName, updated);
  };

  const { handleSubmit, setFieldValue, errors, touched } = useFormik({
    initialValues: preferencesValues, // { musicGenres: [], loungeTypes: [], preferredExperiences: [] }
    validationSchema: preferencesSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const payload = {
          musicGenres: values.musicGenres,
          loungeTypes: values.loungeTypes,
          preferredExperiences: values.preferredExperiences,
        };
        console.log("🚀 ~ payload:", payload); // verify here before API call

        const response = await preferencesMutation.mutateAsync(payload);

        if (response?.success) {
          // Extract and persist token if returned (onboarding completion grants access_token)
          const token = response?.data?.token || response?.data?.accessToken;
          const tokenType = response?.data?.tokenType;

          if (token) {
            Cookies.set("token", token, { expires: 7 });
            localStorage.setItem("token", token);
          }
          if (tokenType) {
            Cookies.set("tokenType", tokenType, { expires: 7 });
            localStorage.setItem("tokenType", tokenType);
            setStoredTokenType(tokenType);
          }

          // Refresh auth state so routing picks up the new access_token
          await queryClient.invalidateQueries({ queryKey: ["auth-me"] });
          handleNext();
        } else {
          ErrorToast(response?.message || "Something went wrong. Please try again.");
        }
      } catch (error) {
        ErrorToast(error?.response?.data?.message || "Something went wrong. Please try again.");
      }
    },
  });

  console.log("errors----> ", errors)

  return (
    <div className="flex flex-col justify-center items-center h-auto">
              <p className="font-bold text-white justify-center text-2xl">Tell Us What You’re Into</p>
              <p className="text-white text-center">We’ll personalize your lounge suggestions, event invites, and offers based on your vibe.</p>

      <form onSubmit={handleSubmit}>

        {/* Music Genres */}
        <div className="mt-4 max-w-[440px]">
          <label className="block text-[16px] font-[500] text-white mb-1">Music Genres</label>
          <label className="block text-[14px] font-[500] text-white mb-2">What kind of music do you prefer?</label>
          <div className="py-4 px-4 flex flex-wrap gap-3 w-full text-center justify-start rounded-[13px] bg-[#EFEFEF1A] border border-[#CACACA]">
            {musicPreferences.map((music, index) => (
              <button
                type="button"
                key={index}
                onClick={() => toggleItem(music, activeMusicGenres, setActiveMusicGenres, "musicGenres")} // 👈
                className={`h-[28px] px-2 text-[12px] rounded-full font-medium transition-all duration-200 ${
                  activeMusicGenres.includes(music) // 👈
                    ? "bg-white text-[#181818]"
                    : "bg-[#99999926] text-white hover:bg-[#8a898926]"
                }`}
              >
                {music}
              </button>
            ))}
          </div>
          {touched.musicGenres && errors.musicGenres && (
  <p className="text-red-600 text-xs mt-1">{errors.musicGenres}</p>
)}
        </div>

        {/* Lounge Types */}
        <div className="mt-4 max-w-[440px]">
          <label className="block text-[16px] font-[500] text-white mb-1">Lounge Types</label>
          <label className="block text-[14px] font-[500] text-white mb-2">What kind of lounges do you prefer?</label>
          <div className="py-4 px-4 flex flex-wrap gap-3 w-full text-center justify-start rounded-[13px] bg-[#EFEFEF1A] border border-[#CACACA]">
            {loungePreferences.map((lounge, index) => (
              <button
                type="button"
                key={index}
                onClick={() => toggleItem(lounge, activeLoungeTypes, setActiveLoungeTypes, "loungeTypes")} // 👈
                className={`h-[28px] px-2 text-[12px] rounded-full font-medium transition-all duration-200 ${
                  activeLoungeTypes.includes(lounge) // 👈
                    ? "bg-white text-[#181818]"
                    : "bg-[#99999926] text-white hover:bg-[#8a898926]"
                }`}
              >
                {lounge}
              </button>
            ))}
          </div>
          {touched.loungeTypes && errors.loungeTypes && (
  <p className="text-red-600 text-xs mt-1">{errors.loungeTypes}</p>
)}

        </div>

        {/* Preferred Experiences */}
        <div className="mt-4 max-w-[440px]">
          <label className="block text-[16px] font-[500] text-white mb-1">Preferred Experiences</label>
          <label className="block text-[14px] font-[500] text-white mb-2">What experiences are you interested in?</label>
          <div className="py-4 px-4 text-[12px] flex flex-wrap gap-3 w-full text-center justify-start rounded-[13px] bg-[#EFEFEF1A] border border-[#CACACA]">
            {experiencePreferences.map((exp, index) => (
              <button
                type="button"
                key={index}
                onClick={() => toggleItem(exp, activeExperiences, setActiveExperiences, "preferredExperiences")} // 👈
                className={`h-[28px] px-2 rounded-full font-medium transition-all duration-200 ${
                  activeExperiences.includes(exp) // 👈
                    ? "bg-white text-[#181818]"
                    : "bg-[#99999926] text-white hover:bg-[#8a898926]"
                }`}
              >
                {exp}
              </button>
            ))}
          </div>
          {touched.preferredExperiences && errors.preferredExperiences && (
  <p className="text-red-600 text-xs mt-1">{errors.preferredExperiences}</p>
)}
        </div>

        {touched.preferences && errors.preferences && (
          <p className="text-red-600 text-xs mt-1">{errors.preferences}</p>
        )}

        <div className="mt-6 w-full flex justify-center">
          <div className="xxl:w-[650px] w-[380px] mt-1 mb-4">
            <AuthButton
              type="submit"
              text={preferencesMutation.isPending ? "Saving..." : "Add"}
              disabled={preferencesMutation.isPending}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Preferences;
