import { FaExclamationTriangle } from "react-icons/fa";
import Button from "./Button";

const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "error",
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onCancel}
      />

      {/* Modal Content */}
      <div className="relative bg-surface w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center ${
                variant === "error"
                  ? "bg-error/10 text-error"
                  : "bg-warning/10 text-warning"
              }`}
            >
              <FaExclamationTriangle size={24} />
            </div>
            <div className="flex-1">
              <h3 className="heading-m text-text-main mb-2 tracking-tight">
                {title}
              </h3>
              <p className="body-sm text-text-muted leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background/50 px-6 py-4 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-border">
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
            className="font-semibold"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === "error" ? "primary" : "secondary"}
            onClick={onConfirm}
            isLoading={isLoading}
            className={`font-bold px-8 ${
              variant === "error"
                ? "bg-error hover:bg-error/90 text-white border-none"
                : ""
            }`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
