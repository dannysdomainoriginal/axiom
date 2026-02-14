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
  disabled: Swal.isVisible,

  error(text: string) {
    if (this.disabled()) return;

    return Toast.fire({
      icon: "error",
      text,
    });
  },

  success(text: string) {
    if (this.disabled()) return;

    return Toast.fire({
      icon: "success",
      text,
    });
  },

  warn(text: string) {
    if (this.disabled()) return;

    return Toast.fire({
      icon: "warning",
      text,
    });
  },

  info(text: string) {
    if (this.disabled()) return;

    return Toast.fire({
      icon: "info",
      text,
    });
  },

  fire(options: SweetAlertOptions) {
    if (this.disabled()) return;
    return Toast.fire(options);
  },
};
