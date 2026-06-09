import * as Yup from "yup";

export const personalDetailSchema = Yup.object({
  profile: Yup.mixed()
    .required("Profile picture is required")
    .test("fileSize", "File size must not exceed 10MB", (value) => {
      return value ? value.size <= 10 * 1024 * 1024 : false;
    })
    .test("fileType", "Only JPEG and PNG formats are allowed", (value) => {
      return value ? ["image/jpeg", "image/png"].includes(value.type) : false;
    })
    .test(
      "resolution",
      "Image resolution must be at least 215x215",
      async (value) => {
        if (!value) return false;

        return new Promise((resolve) => {
          const reader = new FileReader();
          const img = new Image();

          reader.onload = (e) => {
            img.onload = () => {
              resolve(img.width >= 215 && img.height >= 215);
            };
            img.onerror = () => resolve(false);
            img.src = e.target.result;
          };

          reader.onerror = () => resolve(false);
          reader.readAsDataURL(value);
        });
      },
    ),

  fullName: Yup.string()
    .required("Full name is required.")
    .min(1, "Full name must be at least 1 character.")
    .max(64, "Full name cannot exceed 64 characters.")
 
    // Not empty after trim
    .test(
      "not-empty-after-trim",
      "Full name cannot be empty or only spaces.",
      (value) => value?.trim().length > 0,
    )
 
    // No leading spaces
    .test(
      "no-leading-space",
      "Full name cannot start with a space.",
      (value) => (value ? !value.startsWith(" ") : true),
    )
 
    // No multiple consecutive spaces
    .test(
      "no-multiple-spaces",
      "Full name cannot contain multiple consecutive spaces.",
      (value) => (value ? !/ {2,}/.test(value) : true),
    )
 
    // Only allowed characters:
    // Unicode letters, spaces, apostrophes, hyphens
    .matches(
      /^[\p{L}' -]+$/u,
      "Full name can only contain letters, spaces, hyphens (-), and apostrophes (').",
    )
 
    // Prevent numbers
    .test("no-numbers", "Full name cannot contain numbers.", (value) =>
      value ? !/\d/.test(value) : true,
    )
 
    // Prevent HTML/script tags
    .test("no-html", "HTML or script content is not allowed.", (value) =>
      value ? !/<[^>]*>|<\/[^>]*>/g.test(value) : true,
    )
 
    // Sentence Case / Title Case validation
    .test(
      "sentence-case",
      "Each word must start with a capital letter.",
      (value) =>
        value
          ? value
              .trim()
              .split(" ")
              .every((word) => /^[A-ZÀ-Ÿ][\p{L}'-]*$/u.test(word))
          : true,
    ),

  // location: Yup.string()
  //   .required("Location is required")
  //   .min(3, "Location must be at least 3 characters long")
  //   .max(100, "Location cannot exceed 100 characters"),
});

export const preferencesSchema = Yup.object({
  musicGenres: Yup.array()
    .min(1, "Please select at least one music genre")
    .required("Please select at least one music genre"),

  loungeTypes: Yup.array()
    .min(1, "Please select at least one lounge type")
    .required("Please select at least one lounge type"),

  preferredExperiences: Yup.array()
    .min(1, "Please select at least one experience")
    .required("Please select at least one experience"),
});