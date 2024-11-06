import { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./textEditor/editor.css";

import { useTranslation } from "react-i18next";
import { setAuthToken } from "../../utils/setHeader";
import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";
import usePersistedUser from "../../store/usePersistedUser";

import PageHeader from "../../components/Forms/PageHeader";

const UseTerms = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [user] = usePersistedUser();
  const quillRef = useRef(null);

  const [content, setContent] = useState("");

  useEffect(() => {
    getContent();
  }, [lang]);

  const getContent = async () => {
    const res = await api.get(`/admin/terms/${lang}`);

    if (res.data.status === 1) {
      if (res.data.terms) setContent(res.data.terms.content);
      else setContent("");
    } else if (res.data.status === 2) {
      setContent("");
    }
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleSubmit = async () => {
    try {
      if (!user.authority["userterms"]["write"]) {
        showToast(t("noPermission"), "error");
        return;
      }

      setAuthToken();

      const res = await api.post("/admin/save_terms", {
        content: content,
        lang: lang,
      });
      if (res.data.status === 1) {
        showToast(t("successSaved"), "success");
      } else {
        showToast(t("failedSaved"), "error");
      }
    } catch (error) {
      showToast(t("failedSaved"), "error");
    }
  };

  return (
    <div className="w-full md:w-[70%] p-3 mx-auto">
      <div className="w-full mx-auto">
        <PageHeader text={t("userterms")} />
      </div>
      <div className="flex flex-col items-center">
        <ReactQuill
          ref={quillRef} // Attach the ref here
          value={content}
          onChange={handleContentChange}
          theme="snow"
          className="w-full h-96 border border-gray-300 rounded-lg shadow-md"
          placeholder="Start typing..."
          modules={{
            toolbar: [
              [{ header: [6, 5, 4, 3, 2, 1] }],
              [{ size: ["small", false, "large", "huge"] }],
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
