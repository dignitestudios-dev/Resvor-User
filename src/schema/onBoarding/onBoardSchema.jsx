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
    .required("Full name is required")
    .matches(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces")
    .min(3, "Full name must be at least 3 characters long"),
     number: Yup.string()
    .transform((value) => value.replace(/\D/g, "")) // Remove all non-numeric chars
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits.")
    .required("Please enter your phone number"),
  specialDatesData: Yup.object().nullable().required("Birthday is required"),

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