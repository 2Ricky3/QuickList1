import { useState, useCallback } from "react";
type ToastType = "success" | "error" | "info" | "warning";
interface ToastConfig {
  message: string;
  type: ToastType;
  visible: boolean;
}
export const useToast = () => {
  const [toast, setToast] = useState<ToastConfig>({
    message: "",
    type: "success",
    visible: false,
  });
  const showToast = useCallback((message: string, type: ToastType = "success") => {
    setToast({ message, type, visible: true });
  }, []);
  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);
  return {
    toast,
    showToast,
    hideToast,
  };
};
