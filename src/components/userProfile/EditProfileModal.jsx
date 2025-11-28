/* eslint-disable react/prop-types */
import { RxCross2 } from "react-icons/rx";
import { AiOutlinePlus } from "react-icons/ai";
import InputField from "../auth/InputField";
import Button from "../global/Button";
import { binIcon, mapImg, userImage } from "../../assets/export";
import { useState } from "react";
import TagsInputField from "../onBoarding/TagsInputField";
import TagsModal from "../onBoarding/TagsModal";

const EditProfileModal = ({ onClose, onClick, initialData = {} }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const closeModal = () => setModalIsOpen(false);
  const [dateModalData, setDateModalData] = useState("");
  const [formData, setFormData] = useState({
    name: initialData.name || "Mike Smith",
    email: initialData.email || "designer@gmail.com",
    phone: initialData.phone || "+1 462 849 558",
    location: initialData.location || "",
    birthday: initialData.birthday || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSave = () => {
    // Replace with actual save logic (API call / context update)
    console.log("Save profile", formData);
    onClick();
  };

  return (
    <div className="fixed -inset-6 bg-[#0A150F80] z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[880px] max-w-[95%]  overflow-y-auto">
        <div className="flex justify-between items-center px-8 pt-4 ">
          <h2 className="text-[28px] font-bold mb-4">Edit Profile</h2>
          <div onClick={onClose} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>

        <div className="px-8 py-6">
          <div className="relative">
            <img
              src={userImage}
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover"
            />
            <button
              type="button"
              className="absolute bottom-2 left-20 bg-white rounded-full shadow p-2 flex items-center justify-center"
            >
              <AiOutlinePlus className="text-[#111827]" />
            </button>
          </div>
          <div className="flex items-start gap-6 px-2 mt-4">
            <div className="flex-1 grid grid-cols-2 gap-6">
              <InputField
                label="Full Name"
                text="name"
                placeholder="Full Name"
                type="text"
                id={`name`}
                name={`name`}
                maxLength={60}
                value={formData.name}
                onChange={handleChange}
              />

              <InputField
                label="Email Address"
                text="email"
                disabled={true}
                placeholder="designer@gmail.com"
                type="email"
                id={`email`}
                name={`email`}
                maxLength={80}
                value={formData.email}
                onChange={handleChange}
              />

              <InputField
                disabled={true}
                label="Phone Number"
                text="phone"
                placeholder="Phone number"
                type="text"
                id={`phone`}
                name={`phone`}
                maxLength={30}
                value={formData.phone}
                onChange={handleChange}
              />

              <InputField
                label="Location"
                text="location"
                placeholder="Enter address here"
                type="text"
                id={`location`}
                name={`location`}
                maxLength={120}
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[14px] font-[500] text-white mb-2">
                Add birthday and special dates
              </label>

              <TagsInputField setModalIsOpen={setModalIsOpen} />
              {dateModalData && (
                <div
                  className={`flex items-end border border-gray-400 text-sm rounded-[13px] overflow-hidden p-[2px] mt-1.5`}
                >
                  <div className="flex flex-wrap py-1 pl-4 w-[80%] text-[black] font-thin text-[14px]">
                    Date of Birth: {dateModalData?.dobDate?.day}{" "}
                    {dateModalData?.dobDate?.month}{" "}
                    {dateModalData?.dobDate?.year}
                  </div>
                  <div className="flex items-start h-full justify-end w-[20%]">
                    <button
                      type="button"
                      onClick={() => setDateModalData("")}
                      className="py-1.5 rounded-xl"
                    >
                      <img src={binIcon} alt="bin" className="pr-2 w-7" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <img src={mapImg} alt="map" className="rounded-[8px]" />
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="w-[40%]">
              <Button text="Save" type="button" onClick={handleSave} />
            </div>
          </div>
        </div>
      </div>
      {modalIsOpen && (
        <TagsModal
          isOpen={modalIsOpen}
          onClose={closeModal}
          setDateModalData={setDateModalData}
        />
      )}
    </div>
  );
};

export default EditProfileModal;
