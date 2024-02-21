function showTost(message, type = "info") {
  const toastLiveExample = document.getElementById("liveToast");
  if (!message) return alert("No id");

  const alertType = document.getElementById("alertType");
  alertType.innerText = type;

  const tostMessageBody = document.getElementById("message-tost");
  tostMessageBody.innerText = message;

  const toastMessageHeader = document.getElementById("toast-head");
  toastMessageHeader.classList.add("toast-" + type);

  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
  toastBootstrap.show();
}
