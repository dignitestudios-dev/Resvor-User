/* eslint-disable react/prop-types */

import { RxCross2 } from "react-icons/rx";
import { useEffect, useState } from "react";

import {
  experiencePreferences,
  loungePreferences,
  musicPreferences,
} from "../../static/PreferenceCategories";

import Button from "../global/Button";
import { useUpdateProfile } from "../../hooks/queries/useQueries";
import { useQueryClient } from "@tanstack/react-query";


const EditPreferencesModal = ({
  onClose,
  onClick,
  user,
}) => {

  const [activeCategories, setActiveCategories] = useState([]);

  const queryClient = useQueryClient();

  const {
    mutate: updateProfile,
    isPending,
  } = useUpdateProfile();



  // Prefill existing preferences
  useEffect(() => {

    if (user?.preferences) {

      setActiveCategories([
        ...(user.preferences.musicGenres || []),
        ...(user.preferences.loungeTypes || []),
        ...(user.preferences.preferredExperiences || []),
      ]);

    }

  }, [user]);




  const toggleCategory = (category) => {

    if (activeCategories.includes(category)) {

      setActiveCategories(
        activeCategories.filter(
          (cat) => cat !== category
        )
      );

    } else {

      setActiveCategories([
        ...activeCategories,
        category,
      ]);

    }

  };





  const renderPreferenceButton = (
    item,
    index
  ) => (

    <button
      key={index}
      type="button"
      onClick={() =>
        toggleCategory(item)
      }
      className={`h-[28px] px-3 text-[12px] rounded-full font-medium transition-all duration-200 ${
        activeCategories.includes(item)
          ? "bg-blue-950 text-white"
          : "bg-[#99999926] text-[#575757] hover:bg-[#8a898926]"
      }`}
    >
      {item}
    </button>

  );







  const handleSave = () => {


    const updatedPreferences = {

      musicGenres:
        activeCategories.filter((item) =>
          musicPreferences.includes(item)
        ),


      loungeTypes:
        activeCategories.filter((item) =>
          loungePreferences.includes(item)
        ),


      preferredExperiences:
        activeCategories.filter((item) =>
          experiencePreferences.includes(item)
        ),

    };




    updateProfile(
      {
        preferences: updatedPreferences,
      },

      {

        onSuccess: () => {

          queryClient.invalidateQueries([
            "profile",
          ]);


          onClick?.();

          onClose();

        },


        onError: (error) => {

          console.log(
            "Update preferences failed:",
            error
          );

        },

      }

    );

  };






  return (

    <div className="fixed -inset-6 bg-[#0A150F80] z-50 flex items-center justify-center">


      <div className="bg-white rounded-[12px] w-[490px] max-w-[95%] pb-5 h-[700px] overflow-y-auto">



        {/* Header */}

        <div className="flex justify-between items-center px-8 pt-4">


          <h2 className="text-[28px] font-bold mb-4">
            Edit Interests & Preferences
          </h2>



          <div
            onClick={onClose}
            className="cursor-pointer"
          >

            <RxCross2 className="text-[28px] text-[#181818]" />

          </div>


        </div>






        <div className="mt-4 max-w-[440px] mx-6">





          {/* Music */}

          <p className="text-[16px] font-semibold">
            Music Genres
          </p>


          <label className="block text-[14px] font-medium mb-1">
            Choose the music styles you enjoy
          </label>



          <div className="py-4 px-4 flex flex-wrap gap-3 rounded-[15px] border border-[#BEBEBE]">

            {musicPreferences.map(
              renderPreferenceButton
            )}

          </div>







          {/* Lounge */}

          <p className="text-[16px] font-semibold mt-4">
            Lounge Types
          </p>


          <label className="block text-[14px] font-medium mb-1">
            What kind of lounges do you prefer?
          </label>




          <div className="py-4 px-4 flex flex-wrap gap-3 rounded-[15px] border border-[#BEBEBE]">

            {loungePreferences.map(
              renderPreferenceButton
            )}

          </div>









          {/* Experiences */}

          <p className="text-[16px] font-semibold mt-4">
            Preferred Experiences
          </p>



          <label className="block text-[14px] font-medium mb-1">
            What experiences are you interested in?
          </label>





          <div className="py-4 px-4 flex flex-wrap gap-3 rounded-[15px] border border-[#BEBEBE]">

            {experiencePreferences.map(
              renderPreferenceButton
            )}

          </div>



        </div>








        {/* Save Button */}

        <div className="mt-6 flex justify-center">


          <div className="w-[40%]">


            <Button

              text={
                isPending
                  ? "Saving..."
                  : "Save"
              }

              type="button"

              disabled={isPending}

              onClick={handleSave}

            />


          </div>


        </div>





      </div>


    </div>

  );

};



export default EditPreferencesModal;