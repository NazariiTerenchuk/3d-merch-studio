// Toast utility that dispatches events to the global SnackbarProvider
type ToastType = 'success' | 'error' | 'info';

function dispatchToast(message: string, type: ToastType) {
  const event = new CustomEvent('show-snackbar', {
    detail: { message, type },
  });
  window.dispatchEvent(event);
}

export const toast = {
  success: (message: string) => dispatchToast(message, 'success'),
  error: (message: string) => dispatchToast(message, 'error'),
  info: (message: string) => dispatchToast(message, 'info'),
};
