const PrivacyPolicy = () => {
  return (
    <div className="py-8 px-16">
      <div className="bg-white p-6 rounded-2xl mb-4">
        <h1 className="text-[24px] text-[#181818] font-semibold mb-4">
          Privacy Policy
        </h1>

        <p className="text-[15px] text-[#5C5C5C] mb-2">
          <strong>Effective Date:</strong> June 19, 2025
          <br />
          <strong>Last Updated:</strong> June 19, 2025
        </p>

        {/* Section 1 */}
        <h2 className="text-[17px] font-semibold text-[#181818] mb-2">
          1. Acceptance of Terms
        </h2>
        <p className="text-[15px] text-[#5C5C5C] mb-4">
          By accessing or using our mobile application (the &quot;App&quot;),
          you agree to be bound by these Terms of Service. If you do not agree
          to these Terms, please do not use the App.
        </p>

        {/* Section 2 */}
        <h2 className="text-[17px] font-semibold text-[#181818] mb-2">
          2. User Conduct
        </h2>
        <p className="text-[15px] text-[#5C5C5C] mb-4">
          You agree not to:
          <ul className="list-disc list-inside mt-2">
            <li>Use the App for any illegal or unauthorized purpose.</li>
            <li>Interfere with the security or functionality of the App.</li>
            <li>
              Attempt to gain unauthorized access to the App or its systems.
            </li>
            <li>
              Use the App in a way that could harm, disable, overburden, or
              impair the App or interfere with other users&apos; enjoyment of
              the App.
            </li>
          </ul>
        </p>

        {/* Section 3 */}
        <h2 className="text-[17px] font-semibold text-[#181818] mb-2">
          3. Intellectual Property
        </h2>
        <p className="text-[15px] text-[#5C5C5C] mb-4">
          All content and materials on the App, including but not limited to
          text, graphics, logos, images, and software, are the property of the
          company or its licensors and are protected by copyright and other
          intellectual property laws.
        </p>

        {/* Section 4 */}
        <h2 className="text-[17px] font-semibold text-[#181818] mb-2">
          4. Disclaimer of Warranties
        </h2>
        <p className="text-[15px] text-[#5C5C5C] mb-4">
          The App is provided &quot;as is&quot; without warranty of any kind,
          express or implied, including, but not limited to, the implied
          warranties of merchantability, fitness for a particular purpose, and
          non-infringement.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
