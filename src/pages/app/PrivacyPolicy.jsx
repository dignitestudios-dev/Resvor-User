import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="py-8 px-16">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-white font-medium hover:text-gray-300 transition"
      >
        <BsFillArrowLeftCircleFill size={18} />
        Back
      </button>

      <div className="bg-white p-6 rounded-2xl mb-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Privacy Policy
        </h1>

        <div className="text-gray-700 space-y-4 text-sm md:text-base leading-relaxed">
          <p className="font-semibold">
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

          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Information We Collect
          </h2>

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

export default PrivacyPolicy;