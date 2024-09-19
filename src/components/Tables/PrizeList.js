import { useState, useEffect, memo } from "react";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { setAuthToken } from "../../utils/setHeader";
import { showToast } from "../../utils/toastUtil";

import DeleteConfirmModal from "../Modals/DeleteConfirmModal";

function PrizeList({
  trigger,
  setFormData,
  setCuFlag,
  selprizes,
  role = "showPrize",
}) {
  const [prizes, setPrizes] = useState(""); //registered prizes list
  const [delPrizeId, setDelPrizeId] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        if (res.data.status === 1) setPrizes(res.data.prize);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const prizeEdit = (index) => {
    setFormData({
      id: prizes[index]._id,
      name: prizes[index].name,
      rarity: prizes[index].rarity,
      cashBack: prizes[index].cashback,
      grade: prizes[index].grade,
    });
    setCuFlag(0); //set create/edit status editing(0)
  };

  const prizeDel = () => {
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
          {prizes ? (
            prizes.map((data, i) => {
              if (role === "setPrize" && data.status === "set") return;
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
                  <td>{data.cashback}</td>
                  <td>
                    <img
                      width="100"
                      height="200"
                      src={process.env.REACT_APP_SERVER_ADDRESS + data.img_url}
                      className="m-auto"
                    ></img>
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
                          break;
                      }
                    })()}
                  </td>
                  <td>{data.status}</td>
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
                        className="button-22"
                        onClick={() => selprizes(data._id)}
                      >
                        {t("set") + " " + t("prize")}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6">{t("noprize")}</td>
            </tr>
          )}
        </tbody>
      </table>
      <DeleteConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default memo(PrizeList);
