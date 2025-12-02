import * as Yup from "yup";

export const personalDetailSchema = Yup.object({
  profile: Yup.mixed()
    .required("Profile picture is required")
    .test("fileSize", "File size too large (max 2MB)", (value) => {
      return value ? value.size <= 2 * 1024 * 1024 : false;
    })
    .test("fileType", "Only JPG/PNG files are allowed", (value) => {
      return value ? ["image/jpeg", "image/png"].includes(value.type) : false;
    }),

  fullName: Yup.string()
    .required("Full name is required")
    .matches(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces")
    .min(3, "Full name must be at least 3 characters long"),

  //   dobDate: Yup.object({
  //     day: Yup.number()
  //       .required("Day is required")
  //       .min(1, "Day must be between 1 and 31")
  //       .max(31, "Day must be between 1 and 31"),
  //     month: Yup.string()
  //       .required("Month is required")
  //       .matches(
  //         /^(January|February|March|April|May|June|July|August|September|October|November|December)$/,
  //         "Invalid month"
  //       ),
  //     year: Yup.number()
  //       .required("Year is required")
  //       .min(1900, "Year must be after 1900")
  //       .max(new Date().getFullYear(), "Year cannot be in the future"),
  //   }).required("Date of Birth is required"),

  //   specialDates: Yup.array()
  //     .of(
  //       Yup.object({
  //         day: Yup.number().min(1).max(31).required("Day required"),
  //         month: Yup.string().required("Month required"),
  //         year: Yup.number().min(1900).max(2100).required("Year required"),
  //       })
  //     )
  //     .optional(),

  //   location: Yup.object({
  //     lat: Yup.number()
  //       .required("Latitude is required")
  //       .min(-90, "Latitude must be between -90 and 90")
  //       .max(90, "Latitude must be between -90 and 90"),
  //     lng: Yup.number()
  //       .required("Longitude is required")
  //       .min(-180, "Longitude must be between -180 and 180")
  //       .max(180, "Longitude must be between -180 and 180"),
  //   }).required("Location is required"),
});

export const preferencesSchema = Yup.object({
  preferences: Yup.array()
    .min(1, "Please select at least one preference")
    .required("Please select at least one preference"),
});
