import { useTranslation } from "react-i18next";

import PageHeader from "../../components/Forms/PageHeader";

function UseTerms() {
  const { t } = useTranslation();

  return (
    <div className="w-full p-3">
      <div className="w-full md:w-[70%] mx-auto">
        <PageHeader text={t("userterms")} />
      </div>
    </div>
  );
}

export default UseTerms;
