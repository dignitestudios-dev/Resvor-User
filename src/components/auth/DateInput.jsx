/* eslint-disable react/prop-types */
const DateInput = ({
  type = "text",
  value,
  onChange,
  placeholder,
  id,
  name,
  maxLength,
}) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      required={true}
      className={`w-full px-4 py-2.5 text-sm rounded-[14px] bg-transparent ring-1 ring-[#CACACA] 
            focus:ring-2 focus:ring-gray-200 focus:outline-none pr-12 placeholder:font-light placeholder:text-[12px] placeholder:text-[#CACACA]`}
    />
  );
};

export default DateInput;
