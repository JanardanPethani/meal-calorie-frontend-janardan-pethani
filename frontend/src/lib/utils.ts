import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function showErrorToast(
  error: unknown,
  defaultMessage: string = "An error occurred"
) {
  let errorMessage = defaultMessage;

  if (error instanceof AxiosError) {
    errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      defaultMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  toast.error(errorMessage, {
    id: "api-error",
    duration: 5000,
    action: {
      label: "X",
      onClick: () => toast.dismiss("api-error"),
    },
  });

  return errorMessage;
}

export function showSuccessToast(message: string) {
  toast.success(message, {
    id: "api-success",
    duration: 3000,
    action: {
      label: "X",
      onClick: () => toast.dismiss("api-success"),
    },
  });
}
