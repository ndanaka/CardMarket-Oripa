import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";

const Terms = () => {
  const { t, i18n } = useTranslation();
  const [terms, setTerms] = useState("");

  useEffect(() => {
    // Fetch terms content
    const fetchTerms = async () => {
      try {
        const res = await api.get("/admin/get_terms");
        if (res.data.status === 1) {
          setTerms(res.data.terms.content);
        } else if (res.data.status === 2) {
          showToast("Failed to load content.");
        }
      } catch (error) {
        showToast("Error loading content.");
      }
    };

    fetchTerms();
  }, []);
  
  return (
    <div className="lg:w-2/3 mx-auto">
      <div className="flex flex-wrap mb-4">
        <div className=" border-l-[6px] border-blue-500"></div>
        <p className="text-3xl text-center text-gray-700 font-Lexend font-extrabold pl-4">
          {t("terms")}
        </p>
      </div>
      <div
        className="border-1 border-gray-300 p-4"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(terms) }} // Correctly set dangerouslySetInnerHTML here
      />
    </div>
  );
};

export default Terms;
