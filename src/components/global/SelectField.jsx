/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

/**
 * SelectField — global dropdown select component.
 *
 * Props mirror InputField for a consistent API:
 *   label, value, onChange, placeholder, onBlur,
 *   error, touched, name, disabled, required, className
 *
 * Additional props:
 *   options  — array of strings  OR  array of { label, value } objects
 *   searchable — show an inline search box (default: false)
 *   isClearable — allow clearing/deselecting (default: true)
 */
export default function SelectField({
  label,
  value,
  onChange,
  placeholder = "Select an option",
  onBlur,
  error,
  touched,
  name,
  options = [],
  disabled = false,
  required = false,
  searchable = false,
  isClearable = true,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  // Normalise options to always be { label, value }
  const normalised = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  const filtered = searchable
    ? normalised.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      )
    : normalised;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel =
    normalised.find((opt) => opt.value === value)?.label ?? "";

  const handleSelect = (opt) => {
    if (isClearable && opt.value === value) {
      onChange?.("");
    } else {
      onChange?.(opt.value);
    }
    onBlur?.({ target: { name } });
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.("");
    onBlur?.({ target: { name } });
    setIsOpen(false);
    setSearch("");
  };

  const toggle = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  return (
    <div ref={ref}>
      {/* Label — identical to InputField */}
      <label className="block text-[14px] font-[500] text-[#181818] mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Trigger — same ring / rounded style as InputField */}
      <div
        onClick={toggle}
        className={`relative w-full px-4 py-2 text-sm rounded-[15px] bg-transparent ring-1 ring-[#CACACA]
          focus-within:ring-2 focus-within:ring-gray-200 focus:outline-none
          flex justify-between items-center select-none
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${className || ""}`}
      >
        <span
          className={`truncate ${
            selectedLabel
              ? "text-[#181818]"
              : "font-light text-[12px] text-[#727272]"
          }`}
        >
          {selectedLabel || placeholder}
        </span>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          {isClearable && Boolean(value) && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 rounded-full hover:bg-gray-200 text-[#727272] hover:text-[#181818] transition"
              title="Clear selection"
              aria-label="Clear selection"
            >
              <RxCross2 size={16} />
            </button>
          )}
          <span className="text-[#727272]">
            {isOpen ? <IoIosArrowUp size={18} /> : <IoIosArrowDown size={18} />}
          </span>
        </div>
      </div>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="mt-1 border border-[#CACACA] rounded-[15px] bg-white shadow-md overflow-hidden z-50 relative">
          {/* Optional search */}
          {searchable && (
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-4 py-2 text-sm border-b outline-none placeholder:text-[12px] placeholder:text-[#727272]"
            />
          )}

          {/* Options list */}
          <div className="max-h-[180px] overflow-y-auto">
            {isClearable && Boolean(value) && (
              <div
                onClick={handleClear}
                className="px-4 py-2 text-xs text-red-500 font-medium cursor-pointer hover:bg-red-50 border-b border-gray-100 flex items-center justify-between"
              >
                <span>Clear selection</span>
                <RxCross2 size={14} />
              </div>
            )}
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt)}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors
                    ${opt.value === value ? "bg-gray-100 font-medium" : ""}`}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-400">
                No options found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Validation error — identical to InputField */}
      {error && touched && (
        <p className="text-red-600 text-[12px] mt-1">{error}</p>
      )}
    </div>
  );
}
