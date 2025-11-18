import LoungeAbout from "../components/loungeDetail/LoungeAbout";
import LoungeFloorPlan from "../components/loungeDetail/LoungeFloorPlan";
import LoungeGallery from "../components/loungeDetail/LoungeGallery";
import LoungeLocation from "../components/loungeDetail/LoungeLocation";
import LoungeServicesPackages from "../components/loungeDetail/LoungeServicesPackages";
import LoungeSpecialty from "../components/loungeDetail/LoungeSpecialty";

export const tabs = [
  {
    key: "about",
    label: "About",
    content: <LoungeAbout />,
  },
  {
    key: "lounge",
    label: "Lounge Specialty",
    content: <LoungeSpecialty />,
  },
  {
    key: "services",
    label: "Services & Packages",
    content: <LoungeServicesPackages />,
  },
  {
    key: "gallery",
    label: "Gallery",
    content: <LoungeGallery />,
  },
  {
    key: "floor",
    label: "Floor Plan",
    content: <LoungeFloorPlan />,
  },
  {
    key: "location",
    label: "Location",
    content: <LoungeLocation />,
  },
];
