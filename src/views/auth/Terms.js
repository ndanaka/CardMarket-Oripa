import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";

const Terms = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

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

  return (
    <div className="w-full mx-auto mt-2">
      <div className="flex flex-wrap mb-4">
        <div className=" border-l-[6px] border-blue-500"></div>
        <p className="text-3xl text-center text-gray-700 font-Lexend font-extrabold pl-4">
          {t("userterms")}
        </p>
      </div>
      <div
        className="border-1 border-gray-300 p-4"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} // Correctly set dangerouslySetInnerHTML here
      />
    </div>
  );
};

export default Terms;
