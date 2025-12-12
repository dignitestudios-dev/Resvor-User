/* eslint-disable react/prop-types */
const UserProfileModal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-lg shadow-xl relative p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-600 hover:text-black text-xl"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mt-2">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white text-3xl font-bold ">
            {user.avatar}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>

            {user.email && (
              <p className="text-gray-500 text-sm mt-1">{user.email}</p>
            )}
          </div>
        </div>

        {/* User Details */}
        <div className="mt-5 space-y-2 text-gray-700 text-sm">
          {user.phone && (
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
          )}
          {user.country && (
            <p>
              <strong>Country:</strong> {user.country}
            </p>
          )}
          {user.createdAt && (
            <p>
              <strong>Joined:</strong> {user.createdAt}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600"
            onClick={() => onClose()}
          >
            Report
          </button>

          <button
            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
            onClick={() => onClose()}
          >
            Block
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
