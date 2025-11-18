/* eslint-disable react/prop-types */
import { RxCross2 } from "react-icons/rx";
import DatePickerField from "../global/DatePickerField";
import { useEffect, useState } from "react";
import TimePickerField from "../global/TimePickerField";
import InputField from "../auth/InputField";
import FilterSelectableField from "../global/FilterSelectableField";
import Button from "./../global/Button";

const RequestEventModal = ({ onClose, onNext }) => {
  const [startDate, setStartDate] = useState(null);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedSeating, setSelectedSeating] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guestCount: "",
    preferredMusic: "",
    specialRequest: "",
    budget: "",
    ticketAtDoor: "",
    instructions: "",
  });

  const [openField, setOpenField] = useState(null);
  const [endDate, setEndDate] = useState("");

  // Close dropdown on outside click
  useEffect(() => {
    const close = () => setOpenField(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const handleSelect = (option) => {
    setSelectedType((prev) => {
      const exists = prev.some((item) => item.id === option._id);

      if (exists) {
        return prev.filter((item) => item.id !== option._id);
      } else {
        return [...prev, { name: option.name, id: option._id }];
      }
    });
  };

  const handleSelectSeating = (option) => {
    setSelectedSeating((prev) => {
      const exists = prev.some((item) => item.id === option._id);

      if (exists) {
        return prev.filter((item) => item.id !== option._id);
      } else {
        return [...prev, { name: option.name, id: option._id }];
      }
    });
  };

  const handleSelectPackage = (option) => {
    setSelectedPackage((prev) => {
      const exists = prev.some((item) => item.id === option._id);

      if (exists) {
        return prev.filter((item) => item.id !== option._id);
      } else {
        return [...prev, { name: option.name, id: option._id }];
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    const eventData = {
      eventType: selectedType[0]?.name || "Birthday Party",
      date: startDate
        ? startDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          })
        : "26 Dec, 2024",
      startTime: "06:00 PM",
      endTime: "06:00 PM",
      name: formData.name || "Mike Smith",
      email: formData.email || "designer@gmail.com",
      phone: formData.phone || "1 462 849 558",
      guestCount: formData.guestCount
        ? `${formData.guestCount} Guests`
        : "30 Guests",
      preferredMusic: formData.preferredMusic || "Hip Hop, R&B, Rock",
      specialRequest: formData.specialRequest || "Birthday Signage",
      servicesPackages:
        selectedPackage.map((p) => p.name).join(", ") ||
        "Food and Drink Package, Bottle Package",
      preferredSeatingArea:
        selectedSeating[0]?.name || "Outdoor Terrace/ Rooftop",
      budget: formData.budget || "$1000",
      ticketAtDoor: formData.ticketAtDoor || "None",
      instructions: formData.instructions || "",
    };
    onNext(eventData);
  };

  return (
    <div className="fixed inset-0 bg-[#0A150F80] bg-opacity-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[440px] pb-2 h-[700px] overflow-y-scroll ">
        <div
          className={`flex justify-between items-center  px-8 pt-4 border-b-2 border-b-gray-300`}
        >
          <h2 className="text-[28px] font-bold mb-4">Request Event</h2>
          <div onClick={onClose} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>
        <div className="px-8 py-4">
          <div className=" mx-1">
            <FilterSelectableField
              label="Event Type"
              placeholder={"Select Event Type"}
              options={["Anniversary Party", "Birthday Party", "corporate"]}
              value={selectedType}
              onChange={handleSelect}
            />
          </div>
          <div className="my-2 mx-1">
            <DatePickerField
              label="Select Date"
              value={startDate}
              onChange={setStartDate}
            />
          </div>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full flex items-center gap-2 my-2 px-1"
          >
            <TimePickerField
              text="Start Time"
              label="Select Time"
              value={startDate}
              onChange={setStartDate}
              open={openField === "start"}
              onOpen={() =>
                setOpenField(openField === "start" ? null : "start")
              }
              position={"-left-4"}
            />

            <TimePickerField
              text="End Time"
              label="Select Time"
              value={endDate}
              onChange={setEndDate}
              open={openField === "end"}
              onOpen={() => setOpenField(openField === "end" ? null : "end")}
              position={"-right-6"}
            />
          </div>
          <div className="w-full flex items-center gap-2 my-2 px-1">
            <InputField
              label="Full Name"
              text="name"
              placeholder="Full Name"
              type="text"
              id={`name`}
              name={`name`}
              maxLength={30}
              value={formData.name}
              onChange={handleInputChange}
            />
            <InputField
              label="Email address"
              text="email"
              placeholder="example@gamil.com"
              type="email"
              id={`email`}
              name={`email`}
              maxLength={30}
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full flex items-center gap-2 my-2 px-1">
            <InputField
              label="Phone number"
              text="phone"
              placeholder="Phone number"
              type="text"
              id={`phone`}
              name={`phone`}
              maxLength={30}
              value={formData.phone}
              onChange={handleInputChange}
            />
            <InputField
              label="Guest Count"
              text="guest"
              placeholder="Add here"
              type="text"
              id={`guest`}
              name={`guestCount`}
              maxLength={30}
              value={formData.guestCount}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full flex items-center gap-2 my-2 px-1">
            <InputField
              label="Preferred Music Genre"
              text="music"
              placeholder="Add here"
              type="text"
              id={`music`}
              name={`preferredMusic`}
              maxLength={30}
              value={formData.preferredMusic}
              onChange={handleInputChange}
            />
            <InputField
              label="Special Requests"
              text="special"
              placeholder="Add here"
              type="text"
              id={`special`}
              name={`specialRequest`}
              maxLength={30}
              value={formData.specialRequest}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full flex items-center gap-2 my-2 px-1">
            <InputField
              label="Budget"
              text="budget"
              placeholder="Add here"
              type="text"
              id={`budget`}
              name={`budget`}
              maxLength={30}
              value={formData.budget}
              onChange={handleInputChange}
            />
            <InputField
              label="Ticket at door (optional)"
              text="ticket"
              placeholder="Add here"
              type="text"
              id={`ticket`}
              name={`ticketAtDoor`}
              maxLength={30}
              value={formData.ticketAtDoor}
              onChange={handleInputChange}
            />
          </div>
          <div className="my-2 mx-1">
            <FilterSelectableField
              label="Preferred Seating Area"
              placeholder={"Choose preferences"}
              options={["Indoor VIP section", "Outdoor Terrace", "Vip Lounge"]}
              value={selectedSeating}
              onChange={handleSelectSeating}
            />
          </div>
          <div className="my-2 mx-1">
            <FilterSelectableField
              label="Select Services & packages"
              placeholder={"Select Services & packages"}
              options={[
                "Vip table package",
                "Food and drink package",
                "Birthday packages",
              ]}
              value={selectedPackage}
              onChange={handleSelectPackage}
            />
          </div>
          <div className="px-1 ">
            <div>
              <label className="block text-[14px] font-[500] text-[#181818] mb-2">
                Any Instructions{" "}
                <span className="text-[12px] text-[#727272]">(optional)</span>
              </label>
              <div className="relative">
                <textarea
                  type="text"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  placeholder="add text here"
                  maxLength={30}
                  className={`w-full px-4 py-2 text-sm rounded-[15px] bg-transparent ring-1 ring-[#CACACA] 
                          focus:ring-2 focus:ring-gray-200 focus:outline-none pr-12 placeholder:font-light placeholder:text-[12px] placeholder:text-[#727272] `}
                ></textarea>
              </div>
            </div>
          </div>
          <div>
            <div className="mt-4 px-1">
              <Button text="Next" type="button" onClick={handleNext} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestEventModal;
