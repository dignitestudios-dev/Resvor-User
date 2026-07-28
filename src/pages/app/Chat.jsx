import { BsFillSendFill } from "react-icons/bs";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import UserProfileModal from "../../components/chat/UserProfileModal";
import {
  useListChats,
  useGetMessages,
  useSendMessage,
} from "../../hooks/queries/useQueries";
import { useSocket } from "../../context/SocketContext";
import { useQueryClient } from "@tanstack/react-query";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatSidebarTime = (dateStr) => {
  if (!dateStr) return "";
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;
  return d.toLocaleDateString();
};

const getOtherParticipant = (chat, myId) => {
  // chat.otherParticipant may be pre-computed by the backend formatted list
  if (chat.otherParticipant) return chat.otherParticipant;
  // fallback: find from participants array
  const other = (chat.participants || []).find(
    (p) =>
      (p.participantId?._id || p.participantId)?.toString() !== myId?.toString()
  );
  return other
    ? {
      id: other.participantId?._id || other.participantId,
      model: other.participantModel,
      details: other.participantId,
    }
    : null;
};

const getParticipantName = (otherParticipant) => {
  const d = otherParticipant?.details;
  if (!d) return "Unknown";
  return (
    d.name ||
    d.fullName ||
    `${d.firstName || ""} ${d.lastName || ""}`.trim() ||
    "Unknown"
  );
};

const getParticipantAvatar = (otherParticipant) => {
  const d = otherParticipant?.details;
  if (!d) return "?";
  const name =
    d.name ||
    d.fullName ||
    `${d.firstName || ""} ${d.lastName || ""}`.trim() ||
    "?";
  return name.charAt(0).toUpperCase();
};

const getLoungeName = (chat) => {
  if (chat.loungeId?.name) return chat.loungeId.name;
  return null;
};

// ─── Component ───────────────────────────────────────────────────────────────

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const messagesContainerRef = useRef(null);

  // Route state injected by LoungeDetail on initiate chat
  const routeState = location.state;

  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [localMessages, setLocalMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // ── API ──────────────────────────────────────────────────────
  const { data: chatsResponse, isLoading: isChatsLoading } = useListChats();
  const chatList = useMemo(() => chatsResponse?.data || [], [chatsResponse]);

  const selectedChatId = selectedChat?._id;

  const { data: messagesResponse, isLoading: isMessagesLoading } =
    useGetMessages(selectedChatId, 1, 50);

  const { mutate: sendMessageMutate, isPending: isSending } = useSendMessage();

  // Initialise messages whenever the query data changes for the selected chat
  useEffect(() => {
    if (messagesResponse) {
      const rawMsgs = Array.isArray(messagesResponse?.data?.data)
        ? messagesResponse.data.data
        : Array.isArray(messagesResponse?.data)
          ? messagesResponse.data
          : Array.isArray(messagesResponse?.data?.messages)
            ? messagesResponse.data.messages
            : Array.isArray(messagesResponse?.data?.docs)
              ? messagesResponse.data.docs
              : Array.isArray(messagesResponse)
                ? messagesResponse
                : [];

      if (rawMsgs.length > 0) {
        // Sort chronologically (oldest first, newest last)
        const sorted = [...rawMsgs].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setLocalMessages(sorted);
      }
    }
  }, [messagesResponse]);

  // ── Auto-select chat from route state ────────────────────────
  useEffect(() => {
    if (routeState?.chatId && chatList.length > 0) {
      const found = chatList.find((c) => c._id === routeState.chatId);
      if (found) {
        setSelectedChat(found);
      } else if (routeState.chat) {
        // The chat may not be in the list yet (just created); use the raw object
        setSelectedChat(routeState.chat);
      }
    }
  }, [routeState, chatList]);

  // ── Socket: enter/leave room ─────────────────────────────────
  useEffect(() => {
    if (!socket || !selectedChatId) return;

    socket.emit("enter_chat", { chatId: selectedChatId });

    return () => {
      socket.emit("leave_chat", { chatId: selectedChatId });
    };
  }, [socket, selectedChatId]);

  // ── Socket: new_message listener ─────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      const incomingChatId =
        (message.chatId || message.chat)?._id || message.chatId || message.chat;

      // Only append if it belongs to the currently open chat
      if (incomingChatId?.toString() === selectedChatId?.toString()) {
        setLocalMessages((prev) => {
          // deduplicate by _id
          if (prev.some((m) => m._id === message._id)) return prev;

          // Replace matching optimistic message if any
          const optIdx = prev.findIndex(
            (m) =>
              typeof m._id === "string" &&
              m._id.startsWith("optimistic-") &&
              ((m.payload?.text && m.payload?.text === message.payload?.text) ||
                (m.text && m.text === message.text))
          );

          if (optIdx !== -1) {
            const updated = [...prev];
            updated[optIdx] = message;
            return updated;
          }

          return [...prev, message];
        });
      }
      // Always refresh chat list sidebar to update lastMessage & unread counts
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    };

    socket.on("new_message", handleNewMessage);
    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, selectedChatId, queryClient]);

  // ── Socket: mark_as_read listener ────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleMarkAsRead = () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    };

    socket.on("mark_as_read", handleMarkAsRead);
    return () => {
      socket.off("mark_as_read", handleMarkAsRead);
    };
  }, [socket, queryClient]);

  // ── Scroll container to bottom on new messages ───────────────
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [localMessages]);

  // ── Send Message ─────────────────────────────────────────────
  const handleSendMessage = useCallback(() => {
    if (!messageInput.trim() || !selectedChatId || isSending) return;

    const text = messageInput.trim();
    setMessageInput("");

    // Optimistic update
    const optimistic = {
      _id: `optimistic-${Date.now()}`,
      chatId: selectedChatId,
      payload: { text },
      type: "TEXT",
      isOwn: true,
      senderModel: "User",
      createdAt: new Date().toISOString(),
    };
    setLocalMessages((prev) => [...prev, optimistic]);

    sendMessageMutate(
      { chatId: selectedChatId, payload: { text, type: "TEXT" } },
      {
        onSuccess: (res) => {
          const saved = res?.data?.data || res?.data;
          if (saved && saved._id) {
            setLocalMessages((prev) =>
              prev.map((m) =>
                m._id === optimistic._id ? { ...saved, isOwn: true } : m
              )
            );
          }
        },
        onError: (err) => {
          console.error("Failed to send message:", err);
          // Remove optimistic message on error
          setLocalMessages((prev) =>
            prev.filter((m) => m._id !== optimistic._id)
          );
        },
      }
    );
  }, [messageInput, selectedChatId, isSending, sendMessageMutate]);

  // ── Derived: current user id (from first own message or auth) ─
  const isOwnMessage = (msg) => {
    if (msg.isOwn !== undefined) return msg.isOwn;
    return (
      msg.senderModel === "User" ||
      msg.sender?.model === "User" ||
      msg.senderType === "User"
    );
  };

  // ── Filtered chat list ────────────────────────────────────────
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chatList;
    const q = searchQuery.toLowerCase();
    return chatList.filter((chat) => {
      const other = getOtherParticipant(chat, null);
      const name = getParticipantName(other).toLowerCase();
      const lounge = (getLoungeName(chat) || "").toLowerCase();
      return name.includes(q) || lounge.includes(q);
    });
  }, [chatList, searchQuery]);

  // ── Chat selection ────────────────────────────────────────────
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setLocalMessages([]);
  };

  // ── Render ────────────────────────────────────────────────────
  const otherParticipant = selectedChat
    ? getOtherParticipant(selectedChat, null)
    : null;
  const otherName = getParticipantName(otherParticipant);
  const otherAvatar = getParticipantAvatar(otherParticipant);
  const loungeName = selectedChat ? getLoungeName(selectedChat) : null;

  return (
    <>
      {/* Header banner */}
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

      {/* Main chat panel */}
      <div className="flex px-5 lg:px-40">
        {/* ── Left Sidebar ───────────────────────────────────── */}
        <div className="py-4 bg-white rounded-l-[16px] border border-gray-200 -mt-[16em] min-h-[600px] w-80 flex-shrink-0 flex flex-col">
          {/* Search */}
          <div className="py-3 h-[81px] px-4 flex items-center justify-center">
            <div className="w-full flex items-center bg-gray-100 rounded-lg">
              <FaSearch className="text-[#9F9F9F] text-[16px] ml-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-transparent text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Chat list */}
          <div className="flex-1 overflow-y-auto">
            {isChatsLoading ? (
              <div className="flex flex-col gap-3 px-4 mt-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 animate-pulse"
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-2 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredChats.length === 0 ? (
              <p className="text-center text-gray-400 text-sm mt-10 px-4">
                No conversations yet
              </p>
            ) : (
              filteredChats.map((chat) => {
                const other = getOtherParticipant(chat, null);
                const name = getParticipantName(other);
                const avatar = getParticipantAvatar(other);
                const lName = getLoungeName(chat);
                const lastMsg =
                  chat.lastMessage?.payload?.text ||
                  chat.lastMessage?.text ||
                  chat.lastMessage?.message ||
                  "";
                const lastTime = formatSidebarTime(
                  chat.lastMessage?.createdAt || chat.updatedAt
                );
                const unread = chat.unreadCount || 0;
                const isSelected = selectedChat?._id === chat._id;

                return (
                  <div
                    key={chat._id}
                    onClick={() => handleSelectChat(chat)}
                    className={`flex items-center gap-3 py-4 px-4 cursor-pointer border-b border-gray-50 hover:bg-gray-50 transition-colors ${isSelected ? "bg-[#7878ae15]" : ""
                      }`}
                  >
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#010067] to-[#3030b0] flex items-center justify-center text-white font-semibold flex-shrink-0 text-lg">
                      {avatar}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {lName || name}
                        </h3>
                        <span className="text-xs text-gray-400 flex-shrink-0 ml-1">
                          {lastTime}
                        </span>
                      </div>
                      {lName && (
                        <p className="text-xs text-[#010067] truncate font-medium">
                          {name}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 truncate">
                        {lastMsg || "Start chatting…"}
                      </p>
                    </div>

                    {/* Unread badge */}
                    {unread > 0 && (
                      <div className="w-6 h-6 rounded-full bg-indigo-950 text-white text-xs flex items-center justify-center font-semibold flex-shrink-0">
                        {unread > 99 ? "99+" : unread}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Right Chat Panel ───────────────────────────────── */}
        <div className="flex-1 py-4 bg-white rounded-r-[16px] border border-l-0 border-gray-200 -mt-[16em] flex flex-col min-h-[600px] h-[600px]">
          {selectedChat ? (
            <>
              {/* Chat header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3 flex-shrink-0">
                <div
                  onClick={() => setProfileModalOpen(true)}
                  className="cursor-pointer w-12 h-12 rounded-full bg-gradient-to-br from-[#010067] to-[#3030b0] flex items-center justify-center text-white font-semibold text-lg"
                >
                  {otherAvatar}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold text-gray-900 leading-tight truncate">
                    {loungeName || otherName}
                  </h2>
                  {loungeName && (
                    <p className="text-xs text-gray-500 truncate">{otherName} · Manager</p>
                  )}
                </div>
              </div>

              {/* Messages area */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto py-4 px-6 space-y-3"
              >
                {/* Date separator */}
                <div className="flex justify-center">
                  <span className="px-3 py-1 bg-gray-200 text-[#181818] text-xs rounded-md">
                    Today
                  </span>
                </div>

                {isMessagesLoading ? (
                  <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                    Loading messages…
                  </div>
                ) : localMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                    No messages yet. Say hello! 👋
                  </div>
                ) : (
                  localMessages.map((msg) => {
                    const own = isOwnMessage(msg);
                    const text =
                      msg.payload?.text ||
                      msg.text ||
                      msg.message ||
                      msg.content ||
                      "";
                    const mediaUrl = msg.payload?.mediaUrl || msg.mediaUrl;
                    const time = formatTime(msg.createdAt);

                    return (
                      <div
                        key={msg._id}
                        className={`flex items-end gap-2 max-w-full ${own ? "justify-end" : "justify-start"
                          }`}
                      >
                        {/* Other avatar */}
                        {!own && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#010067] to-[#3030b0] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {otherAvatar}
                          </div>
                        )}

                        <div
                          className={`flex flex-col min-w-0 max-w-[75%] sm:max-w-[70%] lg:max-w-[65%] ${own ? "items-end" : "items-start"
                            }`}
                        >
                          {!own && (
                            <span className="text-xs text-gray-500 mb-1 truncate max-w-full">
                              {otherName}
                            </span>
                          )}
                          <div
                            className={`rounded-2xl px-4 py-2.5 max-w-full overflow-hidden ${own
                                ? "bg-gradient-to-br from-[#010067] to-[#000000] text-white rounded-br-sm"
                                : "bg-[#E6E6E6] text-gray-900 rounded-bl-sm"
                              } ${typeof msg._id === "string" &&
                                msg._id.startsWith("optimistic")
                                ? "opacity-70"
                                : ""
                              }`}
                          >
                            {text && (
                              <p className="text-sm leading-relaxed break-words break-all whitespace-pre-wrap [overflow-wrap:anywhere]">
                                {text}
                              </p>
                            )}
                            {mediaUrl && (
                              <img
                                src={mediaUrl}
                                alt="attachment"
                                className="mt-2 rounded-lg max-h-60 object-cover max-w-full"
                              />
                            )}
                          </div>
                          <span
                            className={`text-[10px] mt-1 ${own ? "text-gray-500" : "text-gray-400"
                              }`}
                          >
                            {time}
                          </span>
                        </div>

                        {/* Spacer for own messages */}
                        {own && <div className="w-2" />}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input area */}
              <div className="bg-white border-t border-gray-200 px-4 py-3 flex-shrink-0">
                <div className="flex items-center gap-3 bg-[#EEEEEE] p-1.5 rounded-xl">
                  <input
                    type="text"
                    placeholder="Type Here..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !e.shiftKey && handleSendMessage()
                    }
                    className="flex-1 px-4 py-2.5 text-sm bg-transparent rounded-lg focus:outline-none"
                    disabled={isSending}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || isSending}
                    className="w-10 h-10 bg-indigo-950 text-white rounded-lg flex items-center justify-center hover:bg-indigo-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <BsFillSendFill className="text-[16px]" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
              <div className="text-5xl">💬</div>
              <p className="text-base font-medium">
                Select a conversation to start messaging
              </p>
              <p className="text-sm">
                Choose from your existing conversations on the left
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {profileModalOpen && selectedChat && (
        <UserProfileModal
          user={{
            id: otherParticipant?.id,
            name: otherName,
            avatar: otherAvatar,
            message: "",
          }}
          onClose={() => setProfileModalOpen(false)}
        />
      )}
    </>
  );
};

export default Chat;
