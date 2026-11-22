import { useContext } from "react";
import { ToastContext } from "./toastState";

// Small helper so any page can write: const showToast = useToast(); showToast("Job added");
export function useToast() {
  return useContext(ToastContext);
}
