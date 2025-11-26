import { BsFillSendFill } from "react-icons/bs";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { chats, loungeManagers } from "../../static/MockData";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const Chat = () => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const currentList = loungeManagers;
  const currentChats = selectedUser ? chats[selectedUser.id] || [] : [];
  console.log("🚀 ~ Chat ~ currentChats:", currentChats);
  return (
    <>
      <div className="flex items-center pt-[16px] pb-[18em] homeSectionImage">
        <div className="flex items-center px-5 lg:px-40 gap-3">
          <button type="button" onClick={() => navigate(-1)}>
            <FaArrowLeftLong color="white" size={20} />
          </button>
          <h2 className="text-white text-[30px] mt-0 font-bold leading-[48px] capitalize">
            Messages
          </h2>
        </div>
      </div>
      <div className="flex px-5 lg:px-40">
        <div className="  py-4 bg-white rounded-[16px] border border-gray-200 -mt-[16em] min-h-[600px]">
          {/* Left Sidebar */}
          <div className="w-80 bg-white  flex flex-col">
            {/* Header */}
            <div className="py-3 h-[81px] px-6 flex items-center justify-center ">
              {/* Search Bar */}

              <div className="w-full flex items-center bg-gray-100 rounded-lg ">
                <FaSearch className="text-[#9F9F9F] text-[16px]  ml-3" />

                {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> */}
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full  px-4 py-3 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto">
              {currentList.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`flex items-center gap-3 py-4 px-4 hover:bg-gray-50 cursor-pointer ${
                    selectedUser?.id === user.id
                      ? " bg-[#7878ae15]"
                      : "border-transparent"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {user.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {user.message}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between gap-1.5">
                    <span className="text-xs text-gray-400">{user.time}</span>

                    {user.unread > 0 && (
                      <div className="w-6 h-6 rounded-full bg-indigo-950 text-white text-xs flex items-center justify-center font-semibold flex-shrink-0">
                        {user.unread}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className=" py-4 bg-white rounded-[16px] border border-gray-200 -mt-[16em]">
          {/* Right Chat Area */}
          <div className="flex-1 flex flex-col w-[800px]">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="px-8 bg-white border-b border-gray-200 p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-semibold">
                    {selectedUser.avatar}
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedUser.name}
                  </h2>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto py-2 pr-4 space-y-4 min-h-[400px] ">
                  {/* Today Label */}
                  <div className="flex justify-center ">
                    <span className="px-3 py-1 bg-gray-200 text-[#181818] text-xs rounded-md">
                      Today
                    </span>
                  </div>

                  {/* Chat Messages */}
                  {currentChats.map((chat) => (
                    <div
                      key={chat.id}
                      className={
                        chat.isOwn ? "flex justify-end" : "flex justify-start"
                      }
                    >
                      {/* avatar for incoming messages */}
                      {!chat.isOwn && (
                        <div className="mx-2 w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {selectedUser.avatar}
                        </div>
                      )}

                      <div
                        className={`flex flex-col ${
                          chat.isOwn ? "items-end" : "items-start"
                        }`}
                      >
                        {/* show sender name above incoming messages */}
                        {!chat.isOwn && (
                          <span className="text-sm text-gray-500 mb-1 mt-1">
                            {selectedUser.name}
                          </span>
                        )}

                        <div
                          className={`max-w-md rounded-lg ${
                            chat.isOwn
                              ? "bg-gradient-to-br from-[#010067] to-[#000000] text-white rounded-tr-none"
                              : "bg-[#E6E6E6] text-gray-900 rounded-tl-none"
                          } px-4 py-2`}
                        >
                          <p className="text-sm">{chat.message}</p>
                        </div>

                        <span
                          className={`text-xs mt-1 ${
                            chat.isOwn ? "text-black" : "text-gray-500"
                          }`}
                        >
                          {chat.time}
                        </span>
                      </div>

                      {/* optional avatar placeholder for own messages to keep spacing consistent */}
                      {chat.isOwn && <div className="w-10" />}
                    </div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="bg-white border-t border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Type Here..."
                      className="flex-1 px-4 py-3 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button className="w-10 h-10 bg-indigo-950 text-white rounded-lg flex items-center justify-center hover:bg-primary/90 transition-all">
                      <BsFillSendFill className="text-[20px]" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 mt-[200px]">
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
