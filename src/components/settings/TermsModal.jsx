/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */

import { RxCross2 } from "react-icons/rx";

const TermsModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-[#0A150F80] z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[700px] max-w-[95%] max-h-[90vh] overflow-y-auto pb-6">
        <div className="flex justify-end items-center px-6 pt-4">
          <div onClick={onClose} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full pt-4 px-12 pb-12 text-left text-[#212121] text-[14px] leading-[22px]">
          <h2 className="text-[34px] font-bold text-[#181818] mb-2">
            Terms & Conditions
          </h2>

          <p className="font-semibold text-[15px]">
            Effective Date: October 1, 2025
          </p>

          <div>
            <h3 className="text-[17px] font-semibold text-gray-800 mb-2">
              AGREEMENT BETWEEN USER AND LLADNER BUSINESS SOLUTIONS LLC
            </h3>
            <p className="text-[15px] text-gray-700">
              The <span className="font-semibold">ResVor web application</span>{" "}
              and its associated web pages, operated by{" "}
              <span className="font-semibold">
                Lladner Business Solutions LLC
              </span>{" "}
              ("Lladner," "we," "our," or "us"), are available through{" "}
              <span className="text-indigo-400">www.lladner.com</span> and our
              web application.
            </p>
            <p className="mt-3 text-[15px] text-gray-700">
              By creating an account or using the ResVor web application, you
              agree to these Terms and Conditions ("Terms"), which govern your
              use of our Services. If you do not agree, please discontinue use
              immediately.
            </p>
          </div>

          <div>
            <h3 className="text-[17px] font-semibold text-gray-800 mb-2">
              LINKS TO THIRD-PARTY SITES
            </h3>
            <p className="text-[15px] text-gray-700">
              The ResVor web application may contain links to external web
              application ("Linked Sites"). These are provided for your
              convenience only. Lladner has no control over and is not
              responsible for the content, policies, or updates of any Linked
              Site. Inclusion of a link does not imply endorsement or
              association.
            </p>
          </div>

          <div>
            <h3 className="text-[17px] font-semibold text-gray-800 mb-2">
              ACCEPTABLE USE POLICY
            </h3>
            <p className="mb-3 text-[15px] text-gray-700">
              As a condition of using the ResVor web application, you agree not
              to use it for any unlawful or prohibited purpose. Specifically,
              you will not:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-[15px] text-gray-700">
              <li>
                Upload, post, or transmit content that is unlawful, harmful,
                harassing, defamatory, obscene, fraudulent, pornographic, or
                otherwise objectionable.
              </li>
              <li>
                Share content that infringes intellectual property rights or
                proprietary rights of others without permission.
              </li>
              <li>
                Encourage or promote illegal activity, including but not limited
                to prostitution, hacking, or other criminal conduct.
              </li>
              <li>
                Upload malicious code such as viruses, worms, spyware, or Trojan
                horses.
              </li>
              <li>
                Send unsolicited advertising, spam, chain letters, pyramid
                schemes, or unauthorized solicitations.
              </li>
              <li>
                Impersonate another individual or misrepresent your affiliation
                with a person or entity.
              </li>
              <li>
                Attempt unauthorized access to the ResVor web application, user
                accounts, or related networks.
              </li>
              <li>
                Interfere with or disrupt the performance of the ResVor web
                application or its servers.
              </li>
            </ul>
            <p className="mt-3 text-[15px] text-gray-700">
              Lladner reserves the right to monitor activity, remove content,
              and suspend or terminate accounts that violate these Terms.
            </p>
          </div>

          <div>
            <h3 className="text-[17px] font-semibold text-gray-800 mb-2">
              COMMUNICATION SERVICES
            </h3>
            <p className="text-[15px] text-gray-700">
              The ResVor web application may include forums, chat areas,
              messaging features, or community boards ("Communication
              Services"). You agree to use these features only for lawful
              purposes and in accordance with these Terms. Lladner has no
              obligation to monitor such services but reserves the right to
              remove any content or restrict access without notice.
            </p>
          </div>

          <div>
            <h3 className="text-[17px] font-semibold text-gray-800 mb-2">
              USER SUBMISSIONS
            </h3>
            <p className="text-[15px] text-gray-700">
              Any material, feedback, or suggestions you provide to Lladner
              through the ResVor web application ("Submissions") remain yours.
              However, by submitting, uploading, or posting content, you grant
              Lladner a worldwide, royalty-free license to use, reproduce,
              display, and distribute such Submissions in connection with
              providing and improving our Services.
            </p>
            <p className="mt-3 text-[15px] text-gray-700">
              You represent that you own or have the rights necessary to share
              any Submissions and that doing so does not violate third-party
              rights.
            </p>
          </div>

          <div>
            <h3 className="text-[17px] font-semibold text-gray-800 mb-2">
              PAID MEMBERSHIPS & FEES
            </h3>
            <p className="mb-3 text-[15px] text-gray-700">
              The ResVor web application may offer paid memberships or premium
              features. By subscribing, you authorize us or our third-party
              payment providers (e.g., Stripe, Google Play) to charge your
              chosen payment method.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-[15px] text-gray-700">
              <li>
                Memberships renew automatically unless canceled prior to the
                next billing cycle.
              </li>
              <li>
                Fees are billed in U.S. dollars and may include applicable taxes
                or government charges.
              </li>
              <li>
                Cancellations take effect at the end of the current billing
                period.
              </li>
              <li>
                All payments are non-refundable except as required by law.
              </li>
            </ul>
            <p className="mt-3 text-[15px] text-gray-700">
              It is your responsibility to maintain accurate billing
              information.
            </p>
          </div>

          <div>
            <h3 className="text-[17px] font-semibold text-gray-800 mb-2">
              TEXT MESSAGING SERVICES
            </h3>
            <p className="mb-3 text-[15px] text-gray-700">
              If you opt in, the ResVor web application may send SMS
              notifications related to your account or reservations. Message and
              data rates may apply.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-[15px] text-gray-700">
              <li>
                You may cancel SMS messages at any time by replying "STOP."
              </li>
              <li>
                Support is available by replying "HELP" or contacting{" "}
                <span className="text-indigo-400">support@lladner.com</span>.
              </li>
              <li>
                Carriers are not responsible for delayed or undelivered
                messages.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[17px] font-semibold text-gray-800 mb-2">
              NO SPAM POLICY
            </h3>
            <p className="text-[15px] text-gray-700">
              Using the ResVor web application to send unsolicited bulk emails,
              promotional messages, or spam is strictly prohibited. Accounts
              found in violation may be terminated immediately, and Lladner
              reserves the right to pursue legal remedies.
            </p>
          </div>

          <div>
            <h3 className="text-[17px] font-semibold text-gray-800 mb-2">
              INDEMNIFICATION
            </h3>
            <p className="text-[15px] text-gray-700">
              You agree to indemnify and hold harmless{" "}
              <span className="font-semibold">
                Lladner Business Solutions LLC
              </span>
              , its affiliates, employees, and partners from any claims,
              damages, or expenses (including legal fees) arising from your use
              of the ResVor website, violation of these Terms, or infringement
              of another's rights.
            </p>
          </div>

          <div>
            <h3 className="text-[17px] font-semibold text-gray-800 mb-2">
              LIMITATION OF LIABILITY
            </h3>
            <p className="mb-3 text-[15px] text-gray-700">
              The ResVor web application and all related content and services
              are provided "as is" and "as available." Lladner makes no
              warranties, express or implied, including but not limited to
              merchantability, fitness for a particular purpose, or
              non-infringement.
            </p>
            <p className="text-[15px] text-gray-700">
              To the fullest extent permitted by law, Lladner shall not be
              liable for any indirect, incidental, punitive, or consequential
              damages, including but not limited to loss of profits, data, or
              business opportunities.
            </p>
          </div>

          <div>
            <h3 className="text-[17px] font-semibold text-gray-800 mb-2">
              TERMINATION
            </h3>
            <p className="text-[15px] text-gray-700">
              Lladner reserves the right, in its sole discretion, to suspend or
              terminate your access to the ResVor web application at any time
              without notice, for any reason, including but not limited to
              violation of these Terms.
            </p>
          </div>

          <div>
            <h3 className="text-[17px] font-semibold text-gray-800 mb-2">
              GOVERNING LAW
            </h3>
            <p className="text-[15px] text-gray-700">
              These Terms are governed by the laws of the{" "}
              <span className="font-semibold">
                Commonwealth of Massachusetts, USA
              </span>
              , without regard to conflict of law principles. You agree to
              submit to the exclusive jurisdiction of the state and federal
              courts located in Suffolk County, Massachusetts.
            </p>
          </div>

          <div>
            <h3 className="text-[17px] font-semibold text-gray-800 mb-2">
              CHANGES TO THESE TERMS
            </h3>
            <p className="text-[15px] text-gray-700">
              Lladner may update or revise these Terms at any time. The
              effective date will be posted at the top of this document.
              Continued use of the ResVor web application after updates
              indicates acceptance of the revised Terms.
            </p>
          </div>

          <div>
            <h3 className="text-[17px] font-semibold text-gray-800 mb-2">
              COPYRIGHT & TRADEMARK NOTICE
            </h3>
            <p className="text-[15px] text-gray-700">
              All content, logos, and materials provided through the ResVor web
              application and
              <span className="text-indigo-400"> www.lladner.com</span> are the
              property of{" "}
              <span className="font-semibold">
                Lladner Business Solutions LLC
              </span>{" "}
              or its licensors, protected under U.S. and international copyright
              and trademark laws. Unauthorized use is prohibited.
            </p>
          </div>

          <div>
            <h3 className="text-[17px] font-semibold text-gray-800 mb-2">
              CONTACT INFORMATION
            </h3>
            <p className="space-y-2 text-[15px] text-gray-700">
              For questions about these Terms, please contact us at:
            </p>
            <div className="mt-3 ml-4 text-[15px] text-gray-700">
              <p className="font-semibold">Lladner Business Solutions LLC</p>
              <p>
                Email:{" "}
                <span className="text-indigo-400">support@lladner.com</span>
              </p>
              <p>
                Website:{" "}
                <span className="text-indigo-400">www.lladner.com</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
