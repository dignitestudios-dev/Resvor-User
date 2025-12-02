import { useState } from "react";
import { Logo, twitter, facebook, linkedIn } from "../../assets/export";
// import TermsConditionModal from "../global/TermsCondition";
// import PrivacyPolicyModal from "../global/PrivacyPolicy";
import { useLocation, useNavigate } from "react-router";

const Footer = () => {
  const [isOpen, setIsOpen] = useState("");
  const [isOpentwo, setIsOpentwo] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const handleFaqClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/app/landing") {
      // Same page -> smooth scroll
      const faqSection = document.querySelector("#faq");
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Dusre page -> navigate
      navigate("/app/landing#faq");

      // Small delay tak wait karo, taake DOM load ho jaye
      setTimeout(() => {
        const faqSection = document.querySelector("#faq");
        if (faqSection) {
          faqSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 300); // 300ms is enough after navigation
    }
  };

  return (
    <footer className="homeSectionImage text-white mt-5 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Left: Logo */}
          <div className="flex flex-col items-center md:items-center">
            <img src={Logo} alt="CodeClean Logo" className="h-[10em] mb-2" />
          </div>

          {/* Middle: Social Links */}
          <div className="text-center md:ml-20">
            <h4 className="font-semibold text-[22px] mb-3 pt-[2.6em]">
              Find us on <span className=" text-white">Social Media</span>
            </h4>
            <div className="flex gap-4 justify-center">
              <a href="#">
                <img src={facebook} className="h-10 w-auto" alt="" />
              </a>
              <a href="#">
                <img src={linkedIn} className="h-10 w-auto" alt="" />
              </a>
              <a href="#">
                <img src={twitter} className="h-10 w-auto" alt="" />
              </a>
            </div>
          </div>

          {/* Right: Contact */}
          <div className="text-center md:text-right">
            <h4 className="font-semibold text-[19px] pt-10 mb-2">
              We’re always happy to help.
            </h4>
            <a href="mailto:info@codeclean.com" className="text-white">
              info@resvor.com
            </a>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-slate-500" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm gap-2">
          <p className="text-white">
            Copyright © 2025 CodeClean. All rights reserved.
          </p>
          <div className="flex gap-4 text-white">
            <a
              onClick={() => navigate("/app/terms")}
              className="hover:underline cursor-pointer"
            >
              Terms of Services
            </a>
            {/* <TermsConditionModal isOpen={isOpen} setIsOpen={setIsOpen} /> */}
            <span>|</span>
            <a
              onClick={() => navigate("/app/privacy")}
              className="hover:underline cursor-pointer"
            >
              Privacy Policy
            </a>
            {/* <PrivacyPolicyModal isOpen={isOpentwo} setIsOpen={setIsOpentwo} /> */}
            <span>|</span>
            <a
              onClick={handleFaqClick}
              className="hover:underline cursor-pointer"
            >
              FAQs
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
