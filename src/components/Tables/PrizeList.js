import { useState, useEffect, memo } from "react";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { setAuthToken } from "../../utils/setHeader";
import { showToast } from "../../utils/toastUtil";
import usePersistedUser from "../../store/usePersistedUser";

import DeleteConfirmModal from "../Modals/DeleteConfirmModal";
import formatPrice from "../../utils/formatPrice";

function PrizeList({
  trigger,
  setFormData,
  setCuFlag,
  setprizes,
  role = "showPrize",
  setImgUrl,
}) {
  const [prizes, setPrizes] = useState(""); //registered prizes list
  const [flag, setFlag] = useState(false); //registered prizes list
  const [delPrizeId, setDelPrizeId] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = usePersistedUser();
  const { t } = useTranslation();

  useEffect(() => {
    setAuthToken();
    getPrize();
  }, [trigger]);

  //get registered prize list
  const getPrize = () => {
    api
      .get("/admin/get_prize")
      .then((res) => {
        if (res.data.status === 1) {
          setPrizes(res.data.prize);
          for (let index = 0; index < res.data.prize.length; index++) {
            const element = res.data.prize[index];
            if (element.status === "unset") {
              setFlag(!flag);
              break;
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const prizeEdit = (index) => {
    if (!user.authority["prize"]["write"]) {
      showToast("You have no permission for this action", "error");
      return;
    }

    setFormData({
      id: prizes[index]._id,
      name: prizes[index].name,
      rarity: prizes[index].rarity,
      cashBack: prizes[index].cashback,
      grade: prizes[index].grade,
    });
    setCuFlag(0); //set create/edit status editing(0)
    setImgUrl(process.env.REACT_APP_SERVER_ADDRESS + prizes[index].img_url);
  };

  const prizeDel = () => {
    if (!user.authority["prize"]["delete"]) {
      showToast("You have no permission for this action", "error");
      return;
    }

    api
      .delete(`/admin/del_prize/${delPrizeId}`)
      .then((res) => {
        if (res.data.status === 1) {
          showToast(res.data.msg);
          getPrize();
        } else {
          showToast(res.data.msg, "error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = () => {
    setIsModalOpen(false);
    prizeDel();
  };

  return (
    <>
      {prizes && prizes.length !== 0 ? (
        <table className="border-[1px] w-full  m-auto">
          <thead className="bg-admin_theme_color border-[1px] text-gray-200">
            <tr>
              <th>{t("no")}</th>
              <th>{t("name")}</th>
              <th>{t("rarity")}</th>
              <th>{t("cashback") + t("point")}</th>
              <th>{t("image")}</th>
              <th>{t("Grade")}</th>
              <th>{t("status")}</th>
              <th>{t("action")}</th>
            </tr>
          </thead>
          <tbody>
            {prizes.map((data, i) => {
              if (role === "setPrize" && data.status === "set") {
                return null; // Return null instead of nothing
              }
              return (
                <tr
                  key={data._id}
                  className={`border-2 ${
                    data.status === "set" ? "bg-[#f2f2f2]" : ""
                  }`}
                >
                  <td>{i + 1}</td>
                  <td>{data.name}</td>
                  <td>{data.rarity}</td>
                  <td>{formatPrice(data.cashback)} pt</td>
                  <td>
                    <img
                      className="m-auto object-cover h-[50px] w-[100px]"
                      src={process.env.REACT_APP_SERVER_ADDRESS + data.img_url}
                      alt={data.name} // Add alt text for accessibility
                    />
                  </td>
                  <td>
                    {(() => {
                      switch (data.grade) {
                        case 1:
                          return t("first");
                        case 2:
                          return t("second");
                        case 3:
                          return t("third");
                        case 4:
                          return t("fourth");
                        default:
                          return null; // Return null for other grades
                      }
                    })()}
                  </td>
                  <td>{t(data.status)}</td>
                  <td>
                    {role !== "setPrize" ? (
                      <>
                        <span
                          id={data._id}
                          className="fa fa-edit p-1"
                          onClick={(e) => prizeEdit(i)}
                        ></span>
                        <span
                          className="fa fa-remove p-1"
                          onClick={(e) => {
                            setDelPrizeId(data._id);
                            setIsModalOpen(true);
                          }}
                        ></span>
                      </>
                    ) : (
                      <button
                        className="bg-[#0276ff] text-white text-md py-1 px-3 rounded-md"
                        onClick={() => setprizes(data._id)}
                      >
                        {t("add")}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className="py-2 text-center">{t("noprize")}</div>
      )}

      <DeleteConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default memo(PrizeList);
