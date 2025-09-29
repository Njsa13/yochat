import { toast } from "react-hot-toast";

export const toastErrorHandler = (error, message) => {
  const status = error.status || 500;
  if (status == 400 && error.data?.errors) {
    const messages = error.data?.errors;
    console.log(messages);
    messages.forEach((val) => {
      toast.error(`Error 400: ${val.message}`);
    });
  } else {
    const msg = error.data?.message || message;
    toast.error(`Error ${status}: ${msg}`);
  }
};