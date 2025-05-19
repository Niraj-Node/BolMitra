import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";

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
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
      return () => unsubscribeFromMessages();
    }
  }, [selectedUser._id, getMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
                  isSent ? "bg-primary text-primary-content" : "bg-base-200 text-base-content"
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
                {message.text && <p className="text-sm break-words">{message.text}</p>}
                <p
                  className={`text-[10px] mt-1.5 ${
                    isSent ? "text-primary-content/70" : "text-base-content/70"
                  }`}
                >
                  {formatMessageTime(message.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />

      {previewImage && (
        <MediaPreviewModal image={previewImage} onClose={() => setPreviewImage(null)} />
      )}
    </div>
  );
};

export default ChatContainer;
