import { invoices } from "../../static/MockData";

const Billing = () => {
  return (
    <div className="mx-auto px-6 py-8">
      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="py-6 px-8 border rounded-[7px] space-y-2">
          <p className="text-[#181818B2] text-[17px] font-[500]">
            Next Invoice Issue Date
          </p>
          <h3 className="text-[25.66px] font-semibold text-[#181818]">
            Dec 29, 2024
          </h3>
        </div>
        <div className="py-6 px-8 border rounded-[7px] ">
          <p className="text-[#181818B2] text-[17px] font-[500]">
            Invoice Total
          </p>
          <h3 className="text-[25.66px] font-semibold text-[#181818]">
            $150.00
          </h3>
        </div>
      </div>

      {/* Table Section (Desktop) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead className=" text-gray-700 text-sm uppercase">
            <tr className="border-b text-[#181818] text-[13.9px] font-[600]">
              <th className="py-4 px-4">Date</th>
              <th className="py-4 px-4">Description</th>
              <th className="py-4 px-4">Invoice Total</th>
              <th className="py-4 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((item, idx) => (
              <tr key={idx} className="border-b text-[13.9px]">
                <td className="py-4 px-4">{item.date}</td>
                <td className="py-4 px-4">{item.description}</td>
                <td className="py-4 px-4">{item.total}</td>
                <td className="py-4 px-4 ">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card Section (Mobile) */}
      <div className="space-y-4 md:hidden">
        {invoices.map((item, idx) => (
          <div
            key={idx}
            className="border rounded-xl p-4 shadow-sm bg-gray-50 hover:bg-white transition"
          >
            <div className="flex justify-between mb-2">
              <span className="text-gray-500 text-sm font-medium">Date</span>
              <span className="text-gray-800 font-semibold">{item.date}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500 text-sm font-medium">
                Description
              </span>
              <span className="text-gray-800">{item.description}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500 text-sm font-medium">
                Invoice Total
              </span>
              <span className="text-gray-800">{item.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm font-medium">Status</span>
              <span className="text-green-600 font-semibold">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Billing;
