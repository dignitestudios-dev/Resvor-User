import * as Yup from "yup";

export const logInSchema = Yup.object({
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
      /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
      "Invalid email format."
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
  password: Yup.string()
    .min(8, "Password must contain at least 8 alphanumeric characters.")
    .required("Please enter your password"),
});

export const forgotPasswordSchema = Yup.object({
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
      /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
      "Invalid email format."
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
});

export const updatePasswordSchema = Yup.object({
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

  confPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Password does not match"),
});

export const signUpSchema = Yup.object({
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
      /^[a-zA-Z0-9._%+-]+(?<!\.)@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
      "Invalid email format."
    )
    .test("no-dot-before-at", "Email cannot have a dot before @.", (value) =>
      value ? !/\.@/.test(value) : false
    )
    .test(
      "no-dot-or-hyphen-after-at",
      "Email cannot start domain with dot or hyphen.",
      (value) => (value ? !/@[.-]/.test(value) : false)
    )
    .test(
      "no-hyphen-start-domain",
      "Domain cannot start with hyphen.",
      (value) => {
        const domain = value?.split("@")[1];
        return domain ? !domain.startsWith("-") : false;
      }
    ),

  number: Yup.string()
    .transform((value) => value.replace(/\D/g, "")) // Remove all non-numeric chars
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits.")
    .required("Please enter your phone number"),

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

  confPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Password does not match"),
});
