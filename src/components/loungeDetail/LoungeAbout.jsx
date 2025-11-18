import { BsFillTelephoneFill } from "react-icons/bs";
import { IoMail } from "react-icons/io5";

const LoungeAbout = () => {
  return (
    <div className="space-y-4 text-[#6B6B6B]">
      <h2 className="text-2xl font-bold text-blue-950">Property Description</h2>
      <p className="leading-relaxed">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor labore et dolore magna aliqua eiusmod tempor incididunt ut labore
        et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit, sed do eiusmod tempor labore et dolore magna aliqua
        eiusmod tempor incididunt ut labore et dolore magna aliqua, labore et
        dolore Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed ad
      </p>
      <p className="leading-relaxed">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor labore et dolore magna aliqua eiusmod tempor incididunt ut labore
        et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit, sed do eiusmod tempor labore et dolore magna aliqua
        eiusmod tempor incididunt ut labore et dolore magna aliqua, labore et
        dolore Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed ad
      </p>
      <p className="leading-relaxed">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor labore et dolore magna aliqua eiusmod tempor incididunt ut labore
        et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit, sed do eiusmod tempor labore et dolore magna aliqua
        eiusmod tempor incididunt ut labore et dolore magna aliqua, labore et
        dolore Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed ad
      </p>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Contact Details
        </h3>
        <div className="flex items-center gap-2 text-gray-800">
          {/* <Phone className="w-5 h-5 text-blue-600" /> */}
          <BsFillTelephoneFill className="w-4 h-4 text-blue-900" />
          <span>1 448 478 1148</span>
        </div>
        <div className="flex items-center gap-2 text-gray-800 mt-2">
          {/* <Mail className="w-5 h-5 text-blue-600" /> */}
          <IoMail className="w-4 h-4 text-blue-900" />
          <span>highbarrooftop@gmail.com</span>
        </div>
      </div>
    </div>
  );
};

export default LoungeAbout;
