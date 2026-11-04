// All the helper functions should must be there.
// The functions that you're using multiple times must be there.
// e.g. formatDateToMMDDYYYY, formatEpochToMMDDYYYY, etc.

export const normalizePhoneDigits = (input) => {
  if (!input || typeof input !== "string") return "";
  let cleaned = input.replace(/\D/g, "");
  // If 11 digits starting with 1 (US country code), strip the leading 1
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    cleaned = cleaned.slice(1);
  } else if (cleaned.length > 11 && cleaned.startsWith("1")) {
    cleaned = cleaned.slice(1, 11);
  } else if (cleaned.length > 10) {
    cleaned = cleaned.slice(0, 10);
  }
  return cleaned;
};

export const phoneFormatter = (input) => {
  if (typeof input !== "string") {
    return "";
  }

  const cleaned = normalizePhoneDigits(input);

  if (cleaned.length > 6) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6,
      10
    )}`;
  } else if (cleaned.length > 3) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  } else if (cleaned.length > 0) {
    return `(${cleaned}`;
  }

  return cleaned;
};

// Add this utility function
export const phoneToE164 = (formattedPhone, countryCode = "+1") => {
  if (!formattedPhone || typeof formattedPhone !== "string") {
    return "";
  }
  const digits = normalizePhoneDigits(formattedPhone);
  if (!digits) return "";
  return `${countryCode}${digits}`;
};
