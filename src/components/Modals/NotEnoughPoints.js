function NotEnoughPoints(props) {
  const { headerText, bodyText, okBtnClick, isOpen, setIsOpen } = props;

  const closeModal = () => {
    setIsOpen(false);
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    var modal = document.getElementById("modal");
    if (event.target === modal) {
      setIsOpen(false);
    }
  };

  return (
    <div
      id="modal"
      className={`w-full h-full pt-[150px] z-[10000] bg-gray-600 bg-opacity-50 z-50 fixed top-0 left-0 ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="w-2/5 bg-white rounded-xl shadow-xl shadow-gray-500 m-auto p-2 z-10 animate-[fadeIn_1s_ease-in-out]">
        <div className="flex justify-between">
          <div className="w-full text-2xl text-theme_text_color text-center py-2">
            {headerText}
          </div>
        </div>
        <hr className="w-full"></hr>
        <div className="flex flex-col p-1 text-theme_text_color text-center">
          <div className="w-full flex flex-col justify-between text-xl p-3">
            {bodyText}
          </div>
          <button
            id="closeBtn"
            className="bg-theme_color rounded-md mx-2 text-center px-5 py-2 my-3 hover:bg-red-700 text-white outline-none"
            onClick={okBtnClick}
          >
            Purchase Points
          </button>
          <div className="mx-auto py-2">
            <button
              id="marksBtn"
              className="bg-indigo-600 rounded-md text-center mx-2 px-5 py-2 hover:bg-indigo-700 text-white outline-none"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotEnoughPoints;
