import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import { Check, CheckCheck } from "lucide-react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../utils/time";
import MediaPreviewModal from "./MediaPreviewModal";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    markMessagesAsRead,
  } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  const messageEndRef = useRef(null);
  const lastMarkedMessagesRef = useRef([]);

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
      return () => unsubscribeFromMessages();
    }
  }, [selectedUser._id, getMessages]);

  useEffect(() => {
    if (!messages || messages.length === 0 || !messageEndRef.current) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        messageEndRef.current.scrollIntoView({ behavior: "smooth" });

        const unreadMessages = messages.filter(
          (msg) => msg.receiverId === authUser._id && !msg.read
        );

        const unreadIds = unreadMessages.map((m) => m._id);

        const alreadyMarked = lastMarkedMessagesRef.current.join(",");
        const currentlyUnread = unreadIds.join(",");

        if (currentlyUnread && alreadyMarked !== currentlyUnread) {
          markMessagesAsRead();
          lastMarkedMessagesRef.current = unreadIds;
        }
      }
    };

    // Run on mount if tab is already visible
    if (document.visibilityState === "visible") {
      handleVisibilityChange();
    }

    // Listen for tab visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [messages, authUser._id]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isSent = message.senderId === authUser._id;
          return (
            <div
              key={message._id}
              className={`flex ${isSent ? "justify-end" : "justify-start"}`}
              ref={index === messages.length - 1 ? messageEndRef : null}
            >
              <div
                className={`max-w-[80%] rounded-xl p-3 shadow-sm ${
                  isSent
                    ? "bg-primary text-primary-content"
                    : "bg-base-200 text-base-content"
                }`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer"
                    onClick={() => setPreviewImage(message.image)}
                  />
                )}
                {message.text && (
                  <p className="text-sm break-words">{message.text}</p>
                )}
                {/* Time + Tick container */}
                <div
                  className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] ${
                    isSent ? "text-primary-content/70" : "text-base-content/70"
                  }`}
                >
                  <span>{formatMessageTime(message.createdAt)}</span>
                  {isSent &&
                    (message.read ? (
                      // Read – double tick (dark or bright depending on theme)
                      <CheckCheck className="w-4 h-4 text-primary-content/80 dark:text-primary-content/80" />
                    ) : onlineUsers.includes(selectedUser?._id) ? (
                      // Delivered but not read – double tick light
                      <CheckCheck className="w-4 h-4 text-primary-content/30 dark:text-primary-content/30" />
                    ) : (
                      // Sent but user offline – single tick
                      <Check className="w-4 h-4 text-primary-content/30 dark:text-primary-content/30" />
                    ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />

      {previewImage && (
        <MediaPreviewModal
          image={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </div>
  );
};

export default ChatContainer;
