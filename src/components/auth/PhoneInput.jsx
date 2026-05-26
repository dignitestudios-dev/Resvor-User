// /* eslint-disable react/prop-types */

// import { useState, useMemo } from "react";
// import { getData } from "country-list";
// import emojiFlags from "emoji-flags";

// const PhoneInput = ({
//   value,
//   onChange,
//   onBlur,
//   id,
//   name,
//   isDisabled = false,
//   autoComplete,
//   error,
//   touched,
//   label,
//   placeholderText = null,
// }) => {
//   // Load countries + flags + calling codes
//   const countries = useMemo(() => {
//     return getData()
//       .map((c) => ({
//         name: c.name,
//         iso2: c.code,
//         flag: emojiFlags.countryCode(c.code)?.emoji,
//         dialCode: emojiFlags.countryCode(c.code)?.dialCode,
//       }))
//       .filter((c) => c.dialCode); // remove countries with no dialCode
//   }, []);

//   // Default: US
//   const [selected, setSelected] = useState(
//     countries.find((c) => c.iso2 === "US"),
//   );

//   const handleCountryChange = (e) => {
//     const iso = e.target.value;
//     const found = countries.find((c) => c.iso2 === iso);
//     setSelected(found);
//   };

//   const handleKeyPress = (e) => {
//     if (!/[0-9]/.test(e.key)) e.preventDefault();
//   };

//   return (
//     <div>
//       <label
//         className={`text-[14px] font-[500] ${
//           placeholderText ? placeholderText : "text-white"
//         }`}
//       >
//         {label}
//       </label>

//       <div
//         className={`flex items-center p-0 w-full pl-2 rounded-[15px] border border-[#CACACA]
//         placeholder:text-[12px] placeholder:font-[400] placeholder:text-[#E6E6F0] ${
//           placeholderText ? placeholderText : "text-[#E6E6F0]"
//         } bg-white/10 backdrop-blur-[28.9px] px-3 h-full`}
//       >
//         <div className="w-[20%] ml-2 mb-[1px]">
//           {/* Country Dropdown */}
//           <select
//             value={selected.iso2}
//             onChange={handleCountryChange}
//             className={`bg-transparent ${
//               placeholderText ? placeholderText : "text-white"
//             } text-sm outline-none w-[25%]`}
//           >
//             {countries.map((c) => (
//               <option
//                 key={c.iso2}
//                 value={c.iso2}
//                 className="text-black text-sm"
//               >
//                 {c.flag} {c.name}
//               </option>
//             ))}
//           </select>

//           {/* Dial Code */}
//           <span className="text-[14px] font-[400] w-[40px] text-center ml-2">
//             {selected.dialCode}
//           </span>
//         </div>
//         <div>
//           {/* Phone Number Input */}
//           <input
//             type="text"
//             className={`${
//               placeholderText ? placeholderText : "text-white"
//             } w-full px-4 py-2 text-sm rounded-[15px] bg-transparent ring-1 ring-transparent
//           focus:ring-2 focus:ring-transparent focus:outline-none pr-12
//           placeholder:font-light placeholder:text-[12px] placeholder:text-[#E6E6F0]`}
//             placeholder="123-456-7890"
//             value={value}
//             onChange={onChange}
//             onBlur={onBlur}
//             id={id}
//             name={name}
//             onKeyPress={handleKeyPress}
//             maxLength={10}
//             disabled={isDisabled}
//             autoComplete={autoComplete}
//           />
//         </div>
//       </div>

//       {error && touched && (
//         <p className="text-red-600 text-[12px] mt-3">{error}</p>
//       )}
//     </div>
//   );
// };

// export default PhoneInput;

/* eslint-disable react/prop-types */

const PhoneInput = ({
  value,
  onChange,
  onBlur,
  id,
  name,
  isDisabled = false,
  autoComplete,
  error,
  touched,
  label,
}) => {
  // const handlePhoneChange = (e) => {
  //   const formattedValue = e.target.value.replace(/[^0-9]/g, "");
  //   onChange({
  //     target: {
  //       name: e.target.name,
  //       value: formattedValue,
  //     },
  //   });
  // };

  const handleKeyPress = (e) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div>
      <label htmlFor="" className="text-[14px] font-[500] text-white ">
        {label}
      </label>
      <div
        className={`flex  items-center p-0 w-full pl-2 outline-none font-[500] rounded-[15px]
      border border-[#CACACA] placeholder:text-[12px] placeholder:font-[400]
      placeholder:text-[#E6E6F0] text-[#E6E6F0] bg-white/10 backdrop-blur-[28.9px] h-full px-3 text-sm`}
      >
        <span className="text-xl pr-2">
          <img
            src="https://flagcdn.com/w320/us.png"
            alt="US flag"
            className="w-6 h-4 mr-2"
          />
        </span>

        <span className="text-[12px] font-[400] w-[40px] text-center">+1</span>

        <div className="border-l h-6 mx-2"></div>

        <input
          type="text"
          className={`w-full text-white py-2 text-sm rounded-[15px] bg-transparent ring-1 ring-transparent 
            focus:ring-2 focus:ring-transparent focus:outline-none placeholder:font-light placeholder:text-[12px] placeholder:text-[#E6E6F0]`}
          placeholder="123-456-7890"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onKeyPress={handleKeyPress}
          id={id}
          maxLength={14}
          name={name}
          disabled={isDisabled}
          autoComplete={autoComplete}
        />
      </div>
      {error && touched && (
        <p className="text-red-600 text-[12px] mt-3">{error}</p>
      )}
    </div>
  );
};

export default PhoneInput;
