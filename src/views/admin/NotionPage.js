import { useTranslation } from "react-i18next";

import PageHeader from "../../components/Forms/PageHeader";

function NotionPage() {
  const { t } = useTranslation();

  return (
    <div className="w-full p-3">
      <div className="w-full md:w-[70%] mx-auto">
        <PageHeader text={t("notion")} />
      </div>
    </div>
  );
}

export default NotionPage;
