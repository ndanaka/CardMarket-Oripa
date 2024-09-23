import ReactDOM from "react-dom/client";

let toastRoot = null;

export const initializeToast = () => {
  if (!toastRoot) {
    const toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    document.body.appendChild(toastContainer);
    toastRoot = ReactDOM.createRoot(toastContainer);
  }
};

export const showToast = (
  title = "Notification",
  color = "success",
  duration = 3000
) => {
  if (!toastRoot) {
    console.error("Toast not initialized. Call initializeToast() first.");
    return;
  }

  const toastElement = (
    <div
      className={`flex justify-between items-center animate-[displayEase_3s_linear] p-2 rounded-sm text-white text-center text-base bg-alert_${color} z-[10000]`}
    >
      <div className="px-2">{title}</div>
      <i
        className="fa fa-close p-1 text-white"
        onClick={() => {
          toastRoot.render(null);
        }}
      ></i>
    </div>
  );

  toastRoot.render(toastElement);

  setTimeout(() => {
    toastRoot.render(null);
  }, duration);
};
