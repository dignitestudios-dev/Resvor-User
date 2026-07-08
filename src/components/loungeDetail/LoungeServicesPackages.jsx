// import { loungeImg } from "../../assets/export";
// import Button from "../global/Button";

// const LoungeServicesPackages = () => {
//   return (
//     <div className="space-y-4 text-[#6B6B6B]">
//       <h2 className="text-2xl font-bold text-blue-950">
//         Services and Packages
//       </h2>
//       <div className="grid grid-cols-3 gap-2">
//         <div className="rounded-[16px] p-3 bg-[#f6f5f5] relative">
//           <div>
//             <img
//               src={loungeImg}
//               className="rounded-[12px] w-full"
//               alt="Venue Logo"
//             />
//           </div>
//           <div className="my-2">
//             <p className="text-[16px] text-blue-950 font-[600]">VIP Table</p>
//             <p className="leading-relaxed text-[15px] font-[500]">
//               Includes :{" "}
//             </p>
//             <ul className="list-disc text-[15px] font-[500] list-inside">
//               <li>Lorem ipsum dolor sit amet.</li>
//               <li>Lorem ipsum dolor sit amet.</li>
//               <li>Lorem ipsum dolor sit amet.</li>
//               <li>Lorem ipsum dolor sit amet.</li>
//             </ul>
//           </div>
//           <div className="my-2">
//             <p className="text-indigo-950 text-[20px] font-[700]">
//               Price: $400
//             </p>
//           </div>
//           <div className="w-full flex justify-center ">
//             <div className="w-28 ">
//               <Button text="Add to Booking" type="button" />
//             </div>
//           </div>
//         </div>
//         <div className="rounded-[16px] p-3 bg-[#f6f5f5] relative">
//           <div>
//             <img
//               src={loungeImg}
//               className="rounded-[12px] w-full"
//               alt="Venue Logo"
//             />
//           </div>
//           <div className="my-2">
//             <p className="text-[16px] text-blue-950 font-[600]">VIP Table</p>
//             <p className="leading-relaxed text-[15px] font-[500]">
//               Includes :{" "}
//             </p>
//             <ul className="list-disc text-[15px] font-[500] list-inside">
//               <li>Lorem ipsum dolor sit amet.</li>
//               <li>Lorem ipsum dolor sit amet.</li>
//               <li>Lorem ipsum dolor sit amet.</li>
//               <li>Lorem ipsum dolor sit amet.</li>
//             </ul>
//           </div>
//           <div className="my-2">
//             <p className="text-indigo-950 text-[20px] font-[700]">
//               Price: $400
//             </p>
//           </div>
//           <div className="w-full flex justify-center ">
//             <div className="w-28 ">
//               <Button text="Add to Booking" type="button" />
//             </div>
//           </div>
//         </div>
//         <div className="rounded-[16px] p-3 bg-[#f6f5f5] relative">
//           <div>
//             <img
//               src={loungeImg}
//               className="rounded-[12px] w-full"
//               alt="Venue Logo"
//             />
//           </div>
//           <div className="my-2">
//             <p className="text-[16px] text-blue-950 font-[600]">VIP Table</p>
//             <p className="leading-relaxed text-[15px] font-[500]">
//               Includes :{" "}
//             </p>
//             <ul className="list-disc text-[15px] font-[500] list-inside">
//               <li>Lorem ipsum dolor sit amet.</li>
//               <li>Lorem ipsum dolor sit amet.</li>
//               <li>Lorem ipsum dolor sit amet.</li>
//               <li>Lorem ipsum dolor sit amet.</li>
//             </ul>
//           </div>
//           <div className="my-2">
//             <p className="text-indigo-950 text-[20px] font-[700]">
//               Price: $400
//             </p>
//           </div>
//           <div className="w-full flex justify-center ">
//             <div className="w-28 ">
//               <Button text="Add to Booking" type="button" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoungeServicesPackages;



import Button from "../global/Button";

const LoungeServicesPackages = ({ lounge }) => {
  if (!lounge) {
    return <p>Loading services...</p>;
  }

  const services = lounge?.services || [];
  const currency = lounge?.pricing?.currency?.toUpperCase() || "USD";

  if (!services.length) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-950">
          Services and Packages
        </h2>
        <p>No services available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-[#6B6B6B]">
      <h2 className="text-2xl font-bold text-blue-950">
        Services and Packages
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service._id} className="rounded-[16px] p-3 bg-[#f6f5f5]">
            <div>
              <img
                src={
                  service?.images?.[0]?.location ||
                  "https://via.placeholder.com/300"
                }
                className="rounded-[12px] w-full h-[200px] object-cover"
                alt={service?.name}
              />
            </div>

            <div className="my-2">
              <p className="text-[16px] text-blue-950 font-[600]">
                {service?.name}
              </p>
              <p className="leading-relaxed text-[14px] font-[500] mt-1">
                {service?.description}
              </p>
            </div>

            <div className="my-2">
              <p className="text-indigo-950 text-[18px] font-[700]">
                {/* Price: {currency} {service?.price} */}
                                Price: ${service?.price}

              </p>
            </div>

            <div className="w-full flex justify-center">
              <div className="w-36">
                <Button
                  text="Add to Booking"
                  type="button"
                  onClick={() => console.log("Selected:", service)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoungeServicesPackages;