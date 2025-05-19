import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../utils/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  selectedUser: null,
  isMessagesLoading: false,
  isSending: false,

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/user/${userId}`);
      set({ messages: res.data });

    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    set({ isSending: true });
    try {
      const res = await axiosInstance.post(`/messages/send/user/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSending: false });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });

    // Handle "messagesRead" notification from receiver
    socket.on("messagesRead", ({ from }) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.receiverId === from ? { ...msg, read: true } : msg
        ),
      }));
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messagesRead");
  },

  markMessagesAsRead: () => {
    const socket = useAuthStore.getState().socket;
    const authUser = useAuthStore.getState().authUser;
    const selectedUser = get().selectedUser;
  
    if (!socket || !authUser || !selectedUser) return;
  
    socket.emit("markMessagesAsRead", {
      senderId: selectedUser._id,
      receiverId: authUser._id,
    });
  
    console.log("Emit: markMessagesAsRead");
  },  

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
