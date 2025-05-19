import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import MediaPreviewModal from "./MediaPreviewModal";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const fileInputRef = useRef(null);
  const { isSending, sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {isSending && (
        <div className="flex items-center gap-2 mb-3 text-sm text-zinc-400">
          <Loader2 className="animate-spin w-4 h-4" />
          Sending message...
        </div>
      )}

      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className={`w-20 h-20 object-cover rounded-lg border ${
                isSending ? "cursor-not-allowed opacity-70" : "cursor-pointer"
              }`}
              onClick={() => {
                if (!isSending) setShowFullPreview(true);
              }}
            />
            {!isSending && (
              <button
                onClick={removeImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => {
              if (!isSending) setText(e.target.value);
            }}
            disabled={isSending}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
            disabled={isSending}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => {
              if (!isSending) fileInputRef.current?.click();
            }}
            disabled={isSending}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={(!text.trim() && !imagePreview) || isSending}
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send size={22} />
          )}
        </button>
      </form> */}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        {/* <div className="w-full input input-bordered rounded-lg input-sm sm:input-md flex items-center border px-2 py-1 bg-base-200"> */}
        <div className="flex items-center gap-2 flex-1 bg-base-200 border border-base-300 rounded-lg px-3 py-2">
          <button
            type="button"
            onClick={() => !isSending && fileInputRef.current?.click()}
            disabled={isSending}
            className={`btn btn-ghost btn-sm sm:btn-md p-2 ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
          >
            <Image size={20} />
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
            disabled={isSending}
          />
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full input input-bordered rounded-lg input-sm sm:input-md bg-transparent border-none focus:outline-none flex-1"
            value={text}
            onChange={(e) => !isSending && setText(e.target.value)}
            disabled={isSending}
          />
          <button
            type="submit"
            className="btn btn-sm btn-circle btn-primary"
            disabled={(!text.trim() && !imagePreview) || isSending}
          >
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </form>

      {showFullPreview && imagePreview && !isSending && (
        <MediaPreviewModal image={imagePreview} onClose={() => setShowFullPreview(false)} />
      )}
    </div>
  );
};

export default MessageInput;
