/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */

import { RxCross2 } from "react-icons/rx";

const PrivacyModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-[#0A150F80] z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[700px] max-w-[95%] max-h-[90vh] overflow-y-auto pb-6">
        <div className="flex justify-end items-center px-6 pt-4">
          <div onClick={onClose} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full pt-4 px-12 pb-12 text-left text-gray-700 text-[14px] leading-relaxed">
          <h2 className="text-[34px] font-bold text-[#181818] mb-2">
            Privacy Policy
          </h2>

          <p className="font-semibold text-[15px]">
            Effective Date: October 1, 2025
          </p>

          <p>
            Lladner Business Solutions LLC ("Lladner," "we," "our," or "us")
            respects your privacy and is committed to protecting your personal
            information. This Privacy Policy ("Policy") explains how we collect,
            use, and safeguard your data when you access our website at{" "}
            <span className="text-indigo-400">www.lladner.com</span>, use the{" "}
            <span className="font-semibold">ResVor web application</span> or
            engage with any of our other online platforms, services, or web
            applications (collectively, the "Services").
          </p>

          <p>
            By using the ResVor web application or any of our Services, you
            agree to the practices outlined in this Policy. If we make
            significant changes to how we use your information, we will update
            this Policy and post a revised version on our web application.
            Continued use of our Services after updates are published will
            indicate your acceptance of those changes. If you have any questions
            about this Privacy Policy, please contact us at:{" "}
            <span className="text-indigo-400">privacy@lladner.com</span>.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
            Information We Collect
          </h3>

          <p>
            To use the ResVor web application or other Services, you may be
            asked to register and provide personal details such as your name,
            email address, and other profile information (e.g., location,
            preferences, or date of birth). Additional details you choose to
            share will help us improve your experience but are not mandatory.
          </p>

          <p>
            We do not knowingly collect information from individuals under the
            age of 16. If we learn that a child under 16 has registered for our
            Services, we will promptly delete their information. If you suspect
            that we may have collected data from a minor, please notify us at{" "}
            <span className="text-indigo-400">privacy@lladner.com</span>.
          </p>

          <p>
            We may also automatically collect technical details such as your IP
            address, browser type, operating system, pages you visit, features
            you use, and the referring website. This information is used to
            monitor system performance, improve functionality, and analyze user
            trends.
          </p>

          <p>
            When inviting others to access your ResVor web application, you may
            provide us with their contact details (e.g., email address or phone
            number). While we store this information to deliver invitations and
            messages, we will not sell or share your guests' contact information
            without permission.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
