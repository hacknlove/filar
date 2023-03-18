new EventSource(`/_/refresh`).addEventListener("message", () => {
  location.reload();
});
