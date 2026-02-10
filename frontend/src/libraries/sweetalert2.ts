import Swal, { type SweetAlertOptions } from "sweetalert2";

export const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  timer: 3000,
  showCancelButton: false,
  showConfirmButton: false,
  didOpen(popup) {
    popup.onmouseenter = Swal.stopTimer;
    popup.onmouseleave = Swal.resumeTimer;
  },
});

export const toast = {
  error(text: string) {
    return Toast.fire({
      icon: "error",
      text,
    });
  },

  success(text: string) {
    return Toast.fire({
      icon: "success",
      text,
    });
  },

  warn(text: string) {
    return Toast.fire({
      icon: "warning",
      text,
    });
  },

  info(text: string) {
    return Toast.fire({
      icon: "info",
      text,
    });
  },

  fire: (options: SweetAlertOptions) => Toast.fire(options),
};
