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


export const editGuestbookSchema = Yup.object({
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

  // lounge: Yup.string().required("Please select a lounge."),
});

export const requestEventSchema = Yup.object({
  eventType: Yup.string().required("Event type is required"),
  eventName: Yup.string()
    .required("Event name is required")
    .max(30, "Event name cannot exceed 30 characters.")
    .test(
      "not-empty-after-trim",
      "Event name cannot be empty or only spaces.",
      (value) => value?.trim().length > 0,
    )
    .test(
      "no-leading-space",
      "Event name cannot start with a space.",
      (value) => (value ? !value.startsWith(" ") : true),
    )
    .test(
      "no-multiple-spaces",
      "Event name cannot contain multiple consecutive spaces.",
      (value) => (value ? !/ {2,}/.test(value) : true),
    )
    .test("no-html", "HTML or script content is not allowed.", (value) =>
      value ? !/<[^>]*>|<\/[^>]*>/g.test(value) : true,
    ),
  description: Yup.string()
    .required("Description is required")
    .max(100, "Description cannot exceed 100 characters.")
    .test("no-html", "HTML or script content is not allowed.", (value) =>
      value ? !/<[^>]*>|<\/[^>]*>/g.test(value) : true,
    ),
  startDate: Yup.date()
    .typeError("Date is required")
    .required("Date is required"),
  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string().required("End time is required"),
  name: Yup.string()
    .required("Full name is required.")
    .min(1, "Full name must be at least 1 character.")
    .max(30, "Full name cannot exceed 30 characters.")
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
    .test("no-numbers", "Full name cannot contain numbers.", (value) =>
      value ? !/\d/.test(value) : true,
    )
    .test("no-html", "HTML or script content is not allowed.", (value) =>
      value ? !/<[^>]*>|<\/[^>]*>/g.test(value) : true,
    )
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
  email: Yup.string()
    .required("Email is required")
    .test("no-leading-space", "Email cannot start with a space.", (value) =>
      value ? value[0] !== " " : false
    )
    .test(
      "no-internal-or-trailing-space",
      "Email cannot contain spaces.",
      (value) => (value ? value.trim() === value && !/\s/.test(value) : false)
    )
    .matches(
      /^(?!.*\.\.)(?!.*\.$)[A-Za-z0-9][A-Za-z0-9._+-]*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/,
      "Invalid email format.",
    )
    .test("no-dot-before-at", "Email cannot have a dot before @.", (value) =>
      value ? !/\.@/.test(value) : false
    )
    .test(
      "no-dot-or-hyphen-after-at",
      "Domain cannot start with dot or hyphen.",
      (value) => {
        const domain = value?.split("@")[1];
        return domain ? !/^[.-]/.test(domain) : false;
      }
    ),
  phone: Yup.string()
    .required("Phone number is required")
    .length(10, "Phone number must be exactly 10 digits")
    .matches(/^\d{10}$/, "Phone number must contain only numbers"),
  guestCount: Yup.string()
    .required("Guest count is required")
    .test("is-positive-number", "Enter a valid guest count", (value) => {
      const num = Number(value);
      return !isNaN(num) && num > 0;
    }),
  preferredMusic: Yup.string()
    .max(30, "Preferred music genre cannot exceed 30 characters.")
    .test("no-html", "HTML or script content is not allowed.", (value) =>
      value ? !/<[^>]*>|<\/[^>]*>/g.test(value) : true,
    ),
  specialRequest: Yup.string()
    .max(30, "Special request cannot exceed 30 characters.")
    .test("no-html", "HTML or script content is not allowed.", (value) =>
      value ? !/<[^>]*>|<\/[^>]*>/g.test(value) : true,
    ),
  budget: Yup.string()
    .required("Budget is required")
    .max(8, "Budget cannot exceed 8 digits.")
    .matches(/^\d+$/, "Budget must be a whole number.")
    .test("is-positive-number", "Enter a valid budget", (value) => {
      const num = Number(value);
      return !isNaN(num) && num > 0;
    }),
  ticketAtDoor: Yup.boolean(),
});