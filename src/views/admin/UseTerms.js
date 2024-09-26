import { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./textEditor/editor.css";

import { useTranslation } from "react-i18next";
import { setAuthToken } from "../../utils/setHeader";
import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";

import PageHeader from "../../components/Forms/PageHeader";

// Define custom font options
// const fonts = [
//   { value: "arial", label: "Arial" },
//   { value: "courier", label: "Courier" },
//   { value: "georgia", label: "Georgia" },
//   { value: "times-new-roman", label: "Times New Roman" },
//   { value: "tahoma", label: "Tahoma" },
//   { value: "verdana", label: "Verdana" },
// ];

// // Register font family format
// const Font = Quill.import("formats/font");
// Font.whitelist = fonts.map((font) => font.value);
// Quill.register(Font, true);

const UseTerms = () => {
  const { t } = useTranslation();
  const [content, setContent] = useState("");

  useEffect(() => {
    api.get("/admin/get_terms").then((res) => {
      if (res.data.status === 1) {
        setContent(res.data.terms.content);
      } else if (res.data.status === 2) {
        showToast("Failed to load content.");
      }
    });
  }, []);

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleSubmit = () => {
    setAuthToken();
    api.post("/admin/save_terms", { content: content }).then((res) => {
      if (res.data.status === 1) {
        showToast("Content saved successfully.");
      } else if (res.data.status === 2) {
        showToast("Failed to save content.");
      }
    });
  };

  return (
    <div className="w-full md:w-[70%] p-3 mx-auto">
      <div className="w-full mx-auto">
        <PageHeader text={t("userterms")} />
      </div>
      <div className="flex flex-col items-center">
        <ReactQuill
          value={content}
          onChange={handleContentChange}
          theme="snow" // Basic Quill theme
          className="w-full h-96 border border-gray-300 rounded-lg shadow-md"
          placeholder="Start typing..."
          modules={{
            toolbar: [
              [{ header: [6, 5, 4, 3, 2, 1] }],
              [{ size: ["small", false, "large", "huge"] }],
              // [{ font: fonts.map((font) => font.value) }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
            ],
          }}
        />
        <button
          className="button-22 cursor-pointer w-full my-2"
          onClick={handleSubmit}
        >
          <div className="text-lg text-white hover:text-blue-700">Submit</div>
        </button>
      </div>
    </div>
  );
};

export default UseTerms;
