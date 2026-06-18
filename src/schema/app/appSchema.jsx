import * as Yup from "yup";

export const changePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Please enter your password")
    .matches(/^(?!\s)(?!.*\s$)/, "Password must not begin or end with spaces")
    .min(8, "Password must contain at least 8 characters")
    .matches(/[A-Z]/, "Password must include at least one uppercase letter")
    .matches(/[a-z]/, "Password must include at least one lowercase letter")
    .matches(/\d/, "Password must include at least one number")
    .matches(
      /[^A-Za-z0-9]/,
      "Password must include at least one special character"
    ),

  newPassword: Yup.string()
    .required("Please enter your password")
    .matches(/^(?!\s)(?!.*\s$)/, "Password must not begin or end with spaces")
    .min(8, "Password must contain at least 8 characters")
    .matches(/[A-Z]/, "Password must include at least one uppercase letter")
    .matches(/[a-z]/, "Password must include at least one lowercase letter")
    .matches(/\d/, "Password must include at least one number")
    .matches(
      /[^A-Za-z0-9]/,
      "Password must include at least one special character"
    ),

  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("newPassword")], "Password does not match"),
});






export const guestbookSchema = Yup.object({
  name: Yup.string()
    .required("Full name is required.")
    .min(2, "Full name must be at least 2 characters.")
    .max(50, "Full name cannot exceed 50 characters.")
    .trim()
    .test(
      "not-empty-after-trim",
      "Full name cannot be empty or only spaces.",
      (value) => value?.trim().length > 0,
    )
    .test(
      "no-leading-space",
      "Full name cannot start with a space.",
      (value) => (value ? !value.startsWith(" ") : true),
    )
    .test(
      "no-multiple-spaces",
      "Full name cannot contain multiple consecutive spaces.",
      (value) => (value ? !/ {2,}/.test(value) : true),
    )
    .matches(
      /^[\p{L}' -]+$/u,
      "Full name can only contain letters, spaces, hyphens (-), and apostrophes (').",
    )
    .test(
      "no-numbers",
      "Full name cannot contain numbers.",
      (value) => (value ? !/\d/.test(value) : true),
    )
    .test(
      "no-html",
      "HTML or script content is not allowed.",
      (value) => (value ? !/<[^>]*>|<\/[^>]*>/g.test(value) : true),
    ),

  email: Yup.string()
    .required("Email address is required.")
    .email("Please enter a valid email address.")
    .max(100, "Email address cannot exceed 100 characters.")
    .test(
      "no-leading-space",
      "Email cannot start with a space.",
      (value) => (value ? !value.startsWith(" ") : true),
    )
    .test(
      "no-html",
      "HTML or script content is not allowed.",
      (value) => (value ? !/<[^>]*>|<\/[^>]*>/g.test(value) : true),
    ),

  lounge: Yup.string().required("Please select a lounge."),
});