import { useState, useEffect, memo } from "react";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { setAuthToken } from "../../utils/setHeader";
import { showToast } from "../../utils/toastUtil";
import formatPrice from "../../utils/formatPrice";

import usePersistedUser from "../../store/usePersistedUser";

import DeleteConfirmModal from "../Modals/DeleteConfirmModal";
import Spinner from "../Others/Spinner";

function PrizeList({
  trigger,
  setFormData,
  setCuFlag,
  role,
  setImgUrl,
  prizeType,
  gachaId,
  getGacha,
}) {
  const [user] = usePersistedUser();
  const { t } = useTranslation();

  const [prizes, setPrizes] = useState([]);
  const [delPrizeId, setDelPrizeId] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [spinFlag, setSpinFlag] = useState(false);

  useEffect(() => {
    setAuthToken();
    getPrizes();
  }, [trigger, prizeType]);

  const getPrizes = async () => {
    try {
      setSpinFlag(true);
      const res = await api.get("/admin/prize");
      setSpinFlag(false);

      if (res.data.status === 1)
        switch (prizeType) {
          case "grade":
            setPrizes(
              res.data.prizes.filter(
                (item) =>
                  item.kind === "first" ||
                  item.kind === "second" ||
                  item.kind === "third" ||
                  item.kind === "fourth"
              )
            );
            break;

          case "round":
            setPrizes(
              res.data.prizes.filter(
                (item) => item.kind === "round_number_prize"
              )
            );
            break;

          case "last":
            setPrizes(
              res.data.prizes.filter((item) => item.kind === "last_prize")
            );
            break;

          case "extra":
            setPrizes(
              res.data.prizes.filter((item) => item.kind === "extra_prize")
            );
            break;

          default:
            setPrizes(res.data.prizes);
            break;
        }
    } catch (error) {}
  };

  const prizeEdit = (index) => {
    if (!user.authority["prize"]["write"]) {
      showToast(t("noPermission"), "error");
      return;
    }

    setFormData({
      id: prizes[index]._id,
      name: prizes[index].name,
      rarity: prizes[index].rarity,
      cashBack: prizes[index].cashback,
      kind: prizes[index].kind,
    });
    setCuFlag(0);
    setImgUrl(process.env.REACT_APP_SERVER_ADDRESS + prizes[index].img_url);
  };

  const delPrize = async () => {
    setIsModalOpen(false);

    try {
      if (!user.authority["prize"]["delete"]) {
        showToast(t("noPermission"), "error");
        return;
      }

      setSpinFlag(true);
      const res = await api.delete(`/admin/prize/${delPrizeId}`);
      setSpinFlag(false);

      if (res.data.status === 1) {
        showToast(t(res.data.msg));
        getPrizes();
      } else {
        showToast(t(res.data.msg), "error");
      }
    } catch (error) {
      showToast(t("failedReq"), "error");
    }
  };

  const setPrize = async (prizeId) => {
    try {
      if (!user.authority["gacha"]["write"]) {
        showToast(t("noPermission"), "error");
        return;
      }

      const formData = {
        gachaId: gachaId,
        prizeId: prizeId,
      };

      setSpinFlag(true);
      const res = await api.post("/admin/gacha/set_prize", formData);
      setSpinFlag(false);

      if (res.data.status === 1) {
        showToast(t("successSet"), "success");
        getGacha();
        getPrizes();
      } else {
        showToast(t("failedSet"), "error");
      }
    } catch (error) {
      showToast(t("failedReq"), "error");
    }
  };

  return (
    <div className="overflow-auto w-full">
      {spinFlag && <Spinner />}
      <table className="w-full m-auto">
        <thead className="bg-admin_theme_color text-gray-200">
          <tr>
            <th>{t("no")}</th>
            <th>{t("image")}</th>
            <th>{t("name")}</th>
            <th>{t("rarity")}</th>
            <th>{t("cashback")}</th>
            <th>{t("kind")}</th>
            <th>{t("action")}</th>
          </tr>
        </thead>
        <tbody>
          {prizes && prizes.length !== 0 ? (
            prizes.map((data, i) => {
              if (role === "gacha" && data.status === true) {
                return null;
              }

              return (
                <tr
                  key={data._id}
                  className={`border-2 ${
                    data.status === "set" ? "bg-[#f2f2f2]" : ""
                  }`}
                >
                  <td>{i + 1}</td>
                  <td>
                    <img
                      className="m-auto object-cover h-[50px] w-[100px]"
                      src={process.env.REACT_APP_SERVER_ADDRESS + data.img_url}
                      alt={data.name}
                    />
                  </td>
                  <td>{data.name}</td>
                  <td>{data.rarity}</td>
                  <td>{formatPrice(data.cashback)}pt</td>
                  <td>{t(data.kind)}</td>
                  <td>
                    {role === "gacha" ? (
                      <button
                        className="bg-[#0276ff] text-white text-md py-1 px-3 rounded-md cursor-pointer"
                        onClick={() => setPrize(data._id)}
                      >
                        {t("add")}
                      </button>
                    ) : (
                      <>
                        <span
                          id={data._id}
                          className="fa fa-edit p-1 cursor-pointer"
                          onClick={(e) => prizeEdit(i)}
                        />
                        <span
                          className="fa fa-remove p-1 cursor-pointer"
                          onClick={(e) => {
                            setDelPrizeId(data._id);
                            setIsModalOpen(true);
                          }}
                        />
                      </>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7">{t("noprize")}</td>
            </tr>
          )}
        </tbody>
      </table>

      <DeleteConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={delPrize}
      />
    </div>
  );
}

export default memo(PrizeList);
