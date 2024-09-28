import { useTranslation } from "react-i18next";

import usePersistedUser from "../../store/usePersistedUser";
import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";

import PageHeader from "../../components/Forms/PageHeader";
import { useEffect } from "react";

function NotionPage() {
  const { t } = useTranslation();
  const [user, setUser] = usePersistedUser();

  return (
    <div className="w-full p-3">
      <div className="w-full md:w-[70%] mx-auto">
        <PageHeader text={t("notion")} />
      </div>
    </div>
  );
}

export default NotionPage;
