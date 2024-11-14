import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { setAuthToken } from "../../utils/setHeader";
import { setMultipart, removeMultipart } from "../../utils/setHeader";
import { showToast } from "../../utils/toastUtil";

import DeleteConfirmModal from "../../components/Modals/DeleteConfirmModal";
import PageHeader from "../../components/Forms/PageHeader";
import Spinner from "../../components/Others/Spinner";

import prizeType from "../../utils/prizeType";
import usePersistedUser from "../../store/usePersistedUser";
import uploadimage from "../../assets/img/icons/upload.png";

function PrizeVideo() {
  const { t } = useTranslation();
  const [user] = usePersistedUser();
  const fileInputRef = useRef(null);

  const [prizeVideos, setPrizeVideos] = useState([]);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [cuflag, setCuFlag] = useState(1);
  const [prizeVideoId, setPrizeVideoId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [spinFlag, setSpinFlag] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    kind: "first",
    file: null,
  });

  useEffect(() => {
    setAuthToken();
    getPrizeVideos();
  }, []);

  const extractThumbnail = (videoUrl) => {
    const video = document.createElement("video");
    video.src = videoUrl;
    video.currentTime = 1; // Set the time to capture the thumbnail
    video.addEventListener("loadeddata", () => {
      const canvas = document.createElement("canvas");
      canvas.width = 320; // Set desired width
      canvas.height = 240; // Set desired height
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      setThumbnailUrl(canvas.toDataURL("image/png")); // Set thumbnail URL
    });
  };

  const getPrizeVideos = async () => {
    setAuthToken();

    setSpinFlag(true);
    const res = await api.get("/admin/get_prizeVideos");
    setSpinFlag(false);

    if (res.data.status === 1) {
      setPrizeVideos(res.data.prizeVideos);
    }
  };

  const changeFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVideoChange = (e) => {
    const video = e.target.files[0];
    if (video) {
      setFormData({ ...formData, file: video });
      // const videoUrl = URL.createObjectURL(video);
      // extractThumbnail(videoUrl);
    }
  };

  const handleSubmitSave = async () => {
    if (!user.authority["prizeVideo"]["write"]) {
      showToast(t("noPermission"), "error");
      return;
    }

    try {
      setAuthToken();
      setMultipart();

      if (
        cuflag === 1 &&
        (formData.file === NaN ||
          formData.file === null ||
          formData.file === undefined)
      ) {
        showToast(t("selectFile"), "error");
      } else if (formData.file.type !== "video/mp4") {
        showToast(t("invalidMp4"), "error");
      } else {
        setSpinFlag(true);
        const res = await api.post("/admin/prizeVideo", formData);
        setSpinFlag(false);

        if (res.data.status === 1) {
          showToast(t("successAdded"), "success");
          handleCancel();
          getPrizeVideos();
        } else {
          showToast(t(res.data.msg), "error");
        }
      }
    } catch (error) {
      showToast(t("failedReq"), "error");
    }
  };

  const handleSubmitDelete = async () => {
    setIsModalOpen(false);

    if (!user.authority["prizeVideo"]["delete"]) {
      showToast(t("noPermission"), "error");
      return;
    }

    setSpinFlag(true);
    const res = await api.delete(`/admin/del_prizeVideo/${prizeVideoId}`);
    setSpinFlag(false);

    if (res.data.status === 1) {
      showToast(t("successDeleted"), "success");
      getPrizeVideos();
    } else showToast(t("failedDeleted"), "error");
  };

  const handleCancel = () => {
    fileInputRef.current.value = null;
    setFormData({ id: "", kind: "", file: null });
    setCuFlag(1);
    removeMultipart();
  };

  return (
    <div className="px-3 pt-2 py-24">
      {spinFlag && <Spinner />}
      <div className="w-full md:w-[70%] mx-auto">
        <PageHeader text={t("prizeVideo")} />
      </div>
      <div className="flex flex-wrap">
        <div className="flex flex-col w-full md:w-[35%] border-1 mb-2 h-fit">
          <div className="py-2 bg-admin_theme_color text-gray-200 text-center">
            {t("add") + " " + t("video")}
          </div>
          <div className="flex flex-col justify-between items-center p-2 w-full">
            <label
              htmlFor="fileInput"
              className="text-gray-700 px-1 justify-start flex flex-wrap w-full mb-1"
            >
              {t("video")}
            </label>
            <input
              id="fileInput"
              type="file"
              ref={fileInputRef}
              className="p-1 w-full form-control mb-1"
              onChange={handleVideoChange}
              autoComplete="name"
            />
            {/* <img
              src={thumbnailUrl ? thumbnailUrl : uploadimage}
              alt="Video Thumbnail"
              className={`cursor-pointer ${
                thumbnailUrl ? "w-auto h-[250px]" : ""
              }  object-cover`}
              onClick={() => {
                document.getElementById("fileInput").click();
              }}
            /> */}
          </div>
          <div className="flex flex-col justify-between items-center px-2 w-full">
            <label
              htmlFor="kind"
              className="text-gray-700 px-1 justify-start flex flex-wrap w-full"
            >
              {t("kind")}
            </label>
            <select
              name="kind"
              className="m-1 w-full form-control cursor-pointer"
              onChange={changeFormData}
              value={formData.kind}
              id="kind"
              autoComplete="kind"
            >
              {prizeType.map((item, i) => {
                return (
                  <option key={i} value={item}>
                    {t(item)}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="addBtn flex justify-end m-2">
            {!cuflag ? (
              <button
                className="button-22 !bg-red-500 mx-1"
                onClick={handleCancel}
              >
                {t("cancel")}
              </button>
            ) : null}
            <button className="button-22" onClick={handleSubmitSave}>
              {!cuflag ? t("update") : t("add")}
            </button>
          </div>
        </div>
        <div className="overflow-auto flex flex-wrap w-full md:w-[65%] h-fit">
          <div className="border-1 py-2 bg-admin_theme_color text-gray-200 text-center w-full">
            {t("video") + " " + t("list")}
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-admin_theme_color font-bold text-gray-200">
                <th>{t("no")}</th>
                <th>{t("prize") + " " + t("kind")}</th>
                <th>{t("delete")}</th>
              </tr>
            </thead>
            <tbody>
              {prizeVideos && prizeVideos.length !== 0 ? (
                prizeVideos.map((prizeVideo, i) => (
                  <tr key={prizeVideo._id} className="border-2">
                    <td>{i + 1}</td>
                    <td>{prizeVideo.kind}</td>
                    <td>
                      <span
                        id={prizeVideo._id}
                        className="fa fa-remove p-1 cursor-pointer"
                        onClick={() => {
                          setPrizeVideoId(prizeVideo._id);
                          setIsModalOpen(true);
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">{t("noData")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <DeleteConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSubmitDelete}
      />
    </div>
  );
}

export default PrizeVideo;
