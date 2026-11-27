/* eslint-disable react/prop-types */

const LoungeLocation = ({ lounge }) => {
  const location = lounge?.location;
  const address = location?.address || "";

  let lat = null;
  let lng = null;

  if (location?.coordinates) {
    if (
      location.coordinates.lat !== undefined &&
      location.coordinates.lng !== undefined
    ) {
      lat = Number(location.coordinates.lat);
      lng = Number(location.coordinates.lng);
    } else if (
      Array.isArray(location.coordinates) &&
      location.coordinates.length >= 2
    ) {
      // GeoJSON format: [longitude, latitude]
      lng = Number(location.coordinates[0]);
      lat = Number(location.coordinates[1]);
    }
  } else if (location?.lat !== undefined && location?.lng !== undefined) {
    lat = Number(location.lat);
    lng = Number(location.lng);
  }

  const hasValidCoordinates =
    typeof lat === "number" &&
    typeof lng === "number" &&
    !isNaN(lat) &&
    !isNaN(lng);

  let mapQuery = "";
  if (hasValidCoordinates) {
    mapQuery = `${lat},${lng}`;
  } else if (address) {
    mapQuery = encodeURIComponent(address);
  }

  const embedUrl = mapQuery
    ? `https://maps.google.com/maps?q=${mapQuery}&hl=en&z=15&output=embed`
    : null;

  const externalMapUrl = mapQuery
    ? `https://www.google.com/maps/search/?api=1&query=${mapQuery}`
    : null;

  return (
    <div className="space-y-4 text-[#6B6B6B]">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-950">Location</h2>
        {externalMapUrl && (
          <a
            href={externalMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#010067] hover:underline"
          >
            <span>Open in Google Maps</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        )}
      </div>

      <p className="text-base text-gray-700">
        {address || "No address details available."}
      </p>

      <div className="w-full h-[380px] md:h-[420px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
        {embedUrl ? (
          <iframe
            title={address || "Lounge Location"}
            src={embedUrl}
            className="w-full h-full border-0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No location map available
          </div>
        )}
      </div>
    </div>
  );
};

export default LoungeLocation;
