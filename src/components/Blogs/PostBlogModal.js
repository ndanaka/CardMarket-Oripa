import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormGroup, Form, Input, InputGroup } from "reactstrap";
import uploadimage from "../../assets/img/icons/upload.png";

import api from "../../utils/api";
import { setAuthToken } from "../../utils/setHeader";
import { showToast } from "../../utils/toastUtil";
import { setMultipart, removeMultipart } from "../../utils/setHeader";
import { useEffect } from "react";

const PostBlogModal = (props) => {
  const { t } = useTranslation();

  const { userId, isOpen, setIsOpen, setBlogs } = props;

  const [showErrMessage, setShowErrMessage] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: userId,
    file: null,
  });
  const [imgUrl, setImgUrl] = useState(""); //local image url when file selected

  useEffect(() => {
    setAuthToken();
  });

  const isFormValidate = () => {
    if (formData.title && formData.content && formData.file) return true;
    else return false;
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file !== undefined) {
      setFormData({ ...formData, file: file });
      const reader = new FileReader();

      reader.onload = (e) => {
        setImgUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangeFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    isFormValidate();
  };

  const submitPostBlog = async (e) => {
    setShowErrMessage(true);

    if (!isFormValidate()) return;

    setAuthToken();
    setMultipart();

    const res = await api.post("/user/blog", formData);

    if (res.data.status === 1) {
      setImgUrl("");
      setFormData({
        title: "",
        content: "",
        author: userId,
        file: null,
      });
      removeMultipart();
      setBlogs(res.data.blogs);
      showToast(res.data.msg, "success");
    } else {
      showToast(res.data.msg, "error");
    }

    setIsOpen(false);
    setShowErrMessage(false);
  };

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
      className={`w-full h-full pt-[10%] px-4 sm:px-1 z-[10000] bg-gray-600 bg-opacity-50 fixed top-0 left-0 ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="w-full sm:w-4/5 md:w-3/5 lg:w-2/5 bg-white rounded-xl shadow-xl shadow-gray-500 m-auto z-10 animate-[fadeIn_1s_ease-in-out]">
        <div className="flex justify-between">
          <div className="w-full text-2xl text-theme_text_color text-center py-2">
            {t("postNewBlog")}
          </div>
          <div className="float-right p-2 text-gray-400 hover:text-gray-600">
            <i className="fa fa-close" onClick={closeModal}></i>
          </div>
        </div>
        <hr className="w-full"></hr>
        <div className="flex flex-col p-2 text-theme_text_color text-center">
          <div className="w-full flex flex-col justify-between text-xl p-3">
            <Form role="form">
              <FormGroup>
                <p className="p-1 text-sm float-left">{t("uploadImage")}</p>
                <input
                  name="fileInput"
                  type="file"
                  id="fileInput"
                  className="image p-1 w-full form-control"
                  onChange={handleFileInputChange}
                  autoComplete="name"
                ></input>
                <img
                  src={imgUrl ? imgUrl : uploadimage}
                  alt="prize" // More concise and descriptive
                  width="150px"
                  height="150px"
                  className="image mx-auto mt-2 max-w-[200px]"
                  onClick={() => {
                    document.getElementById("fileInput").click();
                  }}
                />
                {showErrMessage && !formData.file ? (
                  <span className="flex text-sm text-red-600">
                    <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                    {t("requiredFile")}
                  </span>
                ) : null}
              </FormGroup>
              <FormGroup>
                <p className="p-1 text-sm float-left">{t("title")} *</p>
                <InputGroup className="input-group-alternative mb-1">
                  <Input
                    placeholder={t("title")}
                    type="text"
                    name="title"
                    className={`border-[1px] ${
                      showErrMessage && !formData.title ? "is-invalid" : ""
                    }`}
                    value={formData.title}
                    autoComplete="title"
                    onChange={handleChangeFormData}
                  />
                </InputGroup>
                {showErrMessage && !formData.title ? (
                  <span className="flex text-sm text-red-600">
                    <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                    {t("requiredTitle")}
                  </span>
                ) : null}
              </FormGroup>
              <FormGroup>
                <p className="p-1 text-sm float-left">{t("content")} *</p>
                <Input
                  placeholder={t("content")}
                  type="textarea"
                  name="content"
                  className={`border-[1px] h-40 ${
                    showErrMessage && !formData.content ? "is-invalid" : ""
                  }`}
                  value={formData.content}
                  autoComplete="content"
                  onChange={handleChangeFormData}
                />
                {showErrMessage && !formData.content ? (
                  <span className="flex text-sm text-red-600">
                    <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                    {t("requiredContent")}
                  </span>
                ) : null}
              </FormGroup>
            </Form>
          </div>
          <div className="flex justify-between px-4 pb-4">
            <button
              id="closeBtn"
              className="w-1/2 bg-theme_color rounded-md mx-2 text-center px-2 sm:px-5 py-2 hover:bg-red-700 text-white outline-none"
              onClick={() => submitPostBlog()}
            >
              {t("postBlog")}
            </button>
            <button
              id="marksBtn"
              className="w-1/2 bg-indigo-600 rounded-md text-center mx-2 px-2 sm:px-5 py-2 hover:bg-indigo-700 text-white outline-none"
              onClick={closeModal}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostBlogModal;
