/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */

import { RxCross2 } from "react-icons/rx";
import { useFormik } from "formik";

const TermsModal = ({ onClose }) => {
  const { handleSubmit } = useFormik({
    initialValues: {},
    validationSchema: null,
    onSubmit: async (values) => {
      console.log("🚀 ~ TermsModal ~ values:", values);
    },
  });

  return (
    <div className="fixed inset-0 bg-[#0A150F80] z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[600px] max-w-[95%] max-h-[90vh] overflow-y-auto pb-6">
        <div className="flex justify-between items-center px-6 pt-4">
          <div></div>
          <div onClick={onClose} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6 w-full pt-4 px-12 pb-12 text-left text-[#212121] text-[14px] leading-[22px]">
            <h2 className="text-[34px] font-bold text-[#181818] mb-4">
              Terms & Condition
            </h2>
            {/* Section 1 */}
            <div>
              <h3 className="text-[16px] font-semibold mb-2">
                1. Acceptance of Terms
              </h3>
              <p className="text-[14px] text-[#181818B2]">
                By using the mobile application ("App"), you agree to be bound
                by these Terms of Service. If you do not agree to these Terms,
                you must not use the App.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h3 className="text-[16px] font-semibold mb-2">
                2. User Conduct
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-[14px] text-[#181818B2]">
                <li>
                  You must not use the App for any illegal or unauthorized
                  purpose.
                </li>
                <li>
                  You must not interfere with the security or functionality of
                  the App.
                </li>
                <li>
                  You must not attempt to gain unauthorized access to the App or
                  its systems.
                </li>
                <li>
                  You must not use the App in a way that could harm, disable,
                  overburden, or impair the App or interfere with other users'
                  enjoyment.
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h3 className="text-[16px] font-semibold mb-2">
                3. Intellectual Property
              </h3>
              <p className="text-[14px] text-[#181818B2]">
                All content and materials on the App, including text, graphics,
                logos, images, and software, are protected by copyright and
                other intellectual property laws. These materials are owned by
                the App provider or its licensors.
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h3 className="text-[16px] font-semibold mb-2">
                4. Disclaimer of Warranties
              </h3>
              <p className="text-[14px] text-[#181818B2]">
                The App is provided "as is" without warranties of any kind,
                including implied warranties of merchantability, fitness for a
                particular purpose, and non-infringement.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TermsModal;
