/* eslint-disable react/prop-types */

const TagsInputField = ({ setModalIsOpen, isLight = false, text = null }) => {
  const openModal = () => setModalIsOpen(true);

  return (
    <div
      className={`flex items-end border border-gray-400 bg-white/10 backdrop-blur-[28.9px] text-sm rounded-[15px] overflow-hidden p-[3px]`}
    >
      <div
        className={`flex flex-wrap pb-1.5 px-2 w-[80%] ${
          text ? "text-[#727272]" : "text-[#E6E6F0]"
        } italic font-[300]`}
      >
        {text ? text : "Add birthday"}
      </div>
      <div className="flex items-start h-full justify-end w-[20%]">
        {isLight ? (
          <button
            type="button"
            onClick={openModal}
            className="bg-white text-[#012C57] p-1 rounded-xl"
          >
            <svg
              className="h-6 w-6 mb-[1px] p-[2px]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 5a1 1 0 00-1 1v3H6a1 1 0 000 2h3v3a1 1 0 002 0V11h3a1 1 0 100-2h-3V6a1 1 0 00-1-1z" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={openModal}
            className="bg-[#012C57] text-[white] p-1 rounded-xl"
          >
            <svg
              className="h-6 w-6 mb-[1px] p-[2px]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 5a1 1 0 00-1 1v3H6a1 1 0 000 2h3v3a1 1 0 002 0V11h3a1 1 0 100-2h-3V6a1 1 0 00-1-1z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default TagsInputField;
