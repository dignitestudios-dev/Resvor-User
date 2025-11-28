import ImageCarousel from "./ImageCarousal";

const LoungeGallery = () => {
  return (
    <div className="space-y-4 text-[#6B6B6B]">
      <h2 className="text-2xl font-bold text-blue-950">Photos and videos</h2>
      <div className="">
        <ImageCarousel height={"400px"} />
      </div>
    </div>
  );
};

export default LoungeGallery;
