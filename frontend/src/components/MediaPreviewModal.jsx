import { X } from "lucide-react";
import { useEffect } from "react";

const MediaPreviewModal = ({ image, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target.id === "media-backdrop") {
      onClose();
    }
  };

  return (
    <div
      id="media-backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
    >
      <div className="bg-base-100 rounded-xl relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"
        >
          <X size={20} />
        </button>
        <img
          src={image}
          alt="Full Preview"
          className="max-w-full max-h-[80vh] object-contain rounded-xl"
        />
      </div>
    </div>
  );
};

export default MediaPreviewModal;