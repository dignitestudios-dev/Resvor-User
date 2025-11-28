/* eslint-disable react/prop-types */
import { RxCross2 } from "react-icons/rx";
import DatePickerField from "../global/DatePickerField";
import { useEffect, useState } from "react";
import TimePickerField from "../global/TimePickerField";
import InputField from "../auth/InputField";
import FilterSelectableField from "../global/FilterSelectableField";
import Button from "./../global/Button";

const BookingModal = ({ onClose, onNext }) => {
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const [selectedTable, setSelectedTable] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guestCount: "",
    children: "",
    table: "",
    instructions: "",
  });

  const [openField, setOpenField] = useState(null);

  // Close dropdown on outside click
  useEffect(() => {
    const close = () => setOpenField(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const handleSelect = (option) => {
    const name = option?.name || option;
    setSelectedTable((prev) => {
      const exists = prev.some((item) => item.name === name);

      if (exists) {
        return prev.filter((item) => item.name !== name);
      } else {
        return [...prev, { name }];
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    const bookingData = {
      name: formData.name || "Mike Smith",
      email: formData.email || "designer@gmail.com",
      phone: formData.phone || "1 462 849 558",
      date: startDate
        ? startDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          })
        : "26 Dec, 2024",
      time: "06:00pm",
      guestCount: formData.guestCount
        ? `${formData.guestCount} Guests`
        : "6 Guests",
      children: formData.children || "None",
      table: selectedTable[0]?.name || "Table No 15",
      services:
        selectedPackage.map((p) => p.name).join(", ") ||
        "Food and Drink Package, Bottle Package",
      instructions: formData.instructions || "",
    };

    if (onNext) onNext(bookingData);
  };

  const handleSelectPackage = (option) => {
    const name = option?.name || option?.title || option;
    const price = option?.price || null;
    setSelectedPackage((prev) => {
      const exists = prev.some((item) => item.name === name);

      if (exists) {
        return prev.filter((item) => item.name !== name);
      } else {
        return [...prev, { name, price }];
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-[#0A150F80] bg-opacity-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[440px] pb-2 h-[700px] overflow-y-scroll ">
        <div
          className={`flex justify-between items-center  px-8 pt-4 border-b-2 border-b-gray-300`}
        >
          <h2 className="text-[28px] font-bold mb-4">Book Now</h2>
          <div onClick={onClose} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>
        <div className="px-8 py-4">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full flex items-center gap-2 "
          >
            <DatePickerField
              label="Select Date"
              value={startDate}
              onChange={setStartDate}
            />
            <TimePickerField
              text="Time"
              label="Select Time"
              value={startTime}
              onChange={setStartTime}
              open={openField === "time"}
              onOpen={() => setOpenField(openField === "time" ? null : "time")}
              position={"-right-4"}
            />
          </div>
          <div>
            <div className="px-1 py-2">
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
            </div>
            <div className="px-1 py-2">
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
            <div className="px-1 py-2">
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
            </div>
            <div className="w-full flex items-center gap-2 px-1">
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
              <InputField
                label="Children (if any)"
                text="children"
                placeholder="Add here"
                type="text"
                id={`children`}
                name={`children`}
                maxLength={30}
                value={formData.children}
                onChange={handleInputChange}
              />
            </div>
            <div className="my-2 mx-1">
              <FilterSelectableField
                label="Select table"
                placeholder={"Select table"}
                options={["Table No 2", "Table No 5", "Table No 20"]}
                value={selectedTable}
                onChange={handleSelect}
              />
            </div>
            <div className="my-2 mx-1">
              <FilterSelectableField
                label="Select Services & packages"
                placeholder={"Select Services & packages"}
                options={[
                  { title: "Vip table package", price: "20$" },
                  { title: "Food and drink package", price: "40$" },
                  { title: "Birthday packages", price: "25$" },
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
                    maxLength={300}
                    className={`w-full px-4 py-2 text-sm rounded-[15px] bg-transparent ring-1 ring-[#CACACA] 
                            focus:ring-2 focus:ring-gray-200 focus:outline-none pr-12 placeholder:font-light placeholder:text-[12px] placeholder:text-[#727272] `}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="mt-4 px-1">
              <Button text="Next" type="button" onClick={handleNext} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
