const LoungeSpecialty = ({ lounge }) => {  return (
    <div className="space-y-4 text-[#6B6B6B]">
      <h2 className="text-2xl font-bold text-blue-950">
        Lounge Specializations
      </h2>
      <p className="leading-relaxed">What makes us Unique</p>
      <ul className="list-disc text-[#525252] list-inside">
        {lounge?.specialization || "No specific specialization data provided for this lounge."}
      </ul>
    </div>
  );
};

export default LoungeSpecialty;
