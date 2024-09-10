import React from "react";
import ReactDOM from "react-dom";
import { Toast, ToastBody, ToastHeader } from "reactstrap";

const showToast = (message, header, color = "primary") => {
  const toastContainer = document.createElement("div");
  document.body.appendChild(toastContainer);

  ReactDOM.render(
    <Toast className={`bg-${color} text-white`}>
      {header && <ToastHeader>{header}</ToastHeader>}
      <ToastBody>{message}</ToastBody>
    </Toast>,
    toastContainer
  );

  setTimeout(() => {
    ReactDOM.unmountComponentAtNode(toastContainer);
    document.body.removeChild(toastContainer);
  }, 3000);
};

export { showToast };
