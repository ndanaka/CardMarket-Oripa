import { useTranslation } from "react-i18next";

import usePersistedUser from "../../store/usePersistedUser";
import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";

import PageHeader from "../../components/Forms/PageHeader";
import { useEffect } from "react";

function NotionPage() {
  const { t } = useTranslation();
  const [user, setUser] = usePersistedUser();

  useEffect(() => {
    updateUserData();
  }, []);

  const updateUserData = () => {
    if (user) {
      api
        .get(`/admin/get_admin/${user.user_id}`)
        .then((res) => {
          if (res.data.status === 1) {
            res.data.admin.role = "admin";
            setUser(res.data.admin);
          }
        })
        .catch((err) => {
          showToast("Try to login again", "error");
        });
    }
  };

  return (
    <div className="w-full p-3">
      <div className="w-full md:w-[70%] mx-auto">
        <PageHeader text={t("notion")} />
      </div>
    </div>
  );
}

export default NotionPage;
