import { useState, useEffect } from "react";
import AgreeButton from "../../components/Forms/AgreeButton";
import api from "../../utils/api";
import { setAuthToken } from "../../utils/setHeader";
import { setMultipart } from "../../utils/setHeader";
import { showToast } from "../../utils/toastUtil";
import uploadimage from "../../assets/img/icons/upload.png";
import DeleteConfirmModal from "../../components/Modals/DeleteConfirmModal";
import PageHeader from "../../components/Forms/PageHeader";
import GetUser from "../../utils/getUserAtom";
import { useTranslation } from "react-i18next";
function Point() {
  const [formData, setFormData] = useState({
    id: "",
    pointNum: 0,
    price: 0,
    file: null,
  });
  const [points, setPoints] = useState([]);
  const [cuflag, setCuFlag] = useState(1); //determine whether the status is adding or editing, default is adding (1)
  const [imgUrl, setImgUrl] = useState(""); //local image url when file selected
  const [delPointId, setDelPointId] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = GetUser();
  const { t } = useTranslation();
  console.log("points", points);
  useEffect(() => {
    setAuthToken();
    getPoint();
  }, []);

  //handle form change, formData input
  const changeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  console.log("formdata---->", formData);

  //get registered point
  const getPoint = () => {
    setAuthToken();
    api
      .get("/admin/get_point")
      .then((res) => {
        if (res.data.status === 1) setPoints(res.data.points);
        else console.log("getPoint Error---->", res.data.err);
      })
      .catch((err) => console.error(err));
  };
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file !== undefined) {
      setFormData({ ...formData, file: file });
      const reader = new FileReader();

      reader.onload = (e) => {
        setImgUrl(e.target.result);
        console.log(imgUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  /* add and update prize with image file uploading
  if there is a property 'id' vin formData, this perform update of prize */
  const upload = () => {
    if (user.authority.point !== 2 && user.authority.point !== 4) {
      showToast("You have no permission for this action", "error");
      return;
    }
    setMultipart();
    setAuthToken();
    console.log("point upload");
    api.post("/admin/point_upload", formData).then((res) => {
      if (res.data.status === 1) {
        showToast("Point Added Successfully.");
      } else if (res.data.status === 2) {
        setFormData({});
        showToast("Point Updated Successfully.");
        setCuFlag(1); //set create/update flag as creating
      } else {
        showToast("Point Add/Update Failed", "error");
        console.log(res.data.status);
        console.log(res.data.err);
      }
      getPoint();
    });
  };
  //handle Edit Button click event
  const handleEdit = (i) => {
    setFormData({
      id: points[i]._id,
      pointNum: points[i].point_num,
      price: points[i].price,
    });
    setCuFlag(0); //set create/update flag as updating
    setImgUrl(process.env.REACT_APP_SERVER_ADDRESS + points[i].img_url);
  };

  //handle point update
  const updatePoint = () => {
    if (user.authority.point !== 2 && user.authority.point !== 4) {
      showToast("You have no permission for this action", "error");
      return;
    }
    setCuFlag(1);
    upload();
  };
  //handle point delete
  const pointDel = () => {
    if (user.authority.point !== 3 && user.authority.point !== 4) {
      showToast("You have no permission for this action", "error");
      return;
    }
    api.delete(`/admin/del_point/${delPointId}`).then((res) => {
      if (res.data.status === 1) {
        showToast("Successfully Deleted.");
        getPoint();
      } else showToast("Point delete failed.");
    });
  };

  const handleDelete = () => {
    setIsModalOpen(false);
    pointDel();
  };
  return (
    <div className="p-3">
      <div className="w-full md:w-[70%] mx-auto">
        <PageHeader text={t("point")} />
      </div>
      <div className="flex flex-col items-center w-full md:w-[70%] m-auto border-2">
        <div className="py-2 w-full bg-admin_theme_color text-gray-200 text-center">
          {t("point") + " " + t("add")}
        </div>
        <div className="flex flex-col items-center w-full md:w-[70%]">
          <div className="flex flex-wrap justify-between items-center my-1 mt-4 w-[70%]">
            <label className="text-gray-700 px-2">
              {t("point") + " " + t("amount")}:{" "}
            </label>
            <input
              name="pointNum"
              className="p-1 w-full form-control"
              onChange={changeFormData}
              value={formData.pointNum}
            ></input>
          </div>
          <div className="flex flex-wrap justify-between my-1 w-[70%]">
            <label className="text-gray-700 px-2">{t("price")}: </label>
            <input
              name="price"
              className="p-1 w-full form-control"
              onChange={changeFormData}
              value={formData.price}
            ></input>
          </div>
          <div className="flex flex-wrap justify-between my-1 items-center w-[70%]">
            <label className="text-gray-700 px-2">
              {t("point") + " " + t("image")}:{" "}
            </label>
            <input
              name="file"
              type="file"
              id="fileInput"
              className="image p-1 w-full form-control"
              onChange={handleFileInputChange}
            ></input>
            <img
              src={imgUrl ? imgUrl : uploadimage}
              alt="prize image"
              width="150px"
              height="150px"
              className="image mx-auto mt-2 max-w-[200px]"
              onClick={() => {
                document.getElementById("fileInput").click();
              }}
            ></img>
          </div>
          {cuflag ? (
            <AgreeButton name={t("add")} addclass="" onClick={upload} />
          ) : (
            <AgreeButton name={"update"} addclass="" onClick={updatePoint} />
          )}
        </div>
      </div>
      <div className="mx-auto mt-5 w-full md:w-[70%] overflow-auto">
        <table className="border-2 w-full  m-auto">
          <thead>
            <tr className="bg-admin_theme_color font-bold text-gray-200">
              <th>{t("no")}</th>
              <th>{t("point") + " " + t("amount")}</th>
              <th>{t("price")}</th>
              <th>{t("point") + " " + t("image")}</th>
              <th>{t("action")}</th>
            </tr>
          </thead>
          <tbody>
            {points ? (
              points.map((data, i) => (
                <tr key={data._id} className="border-2">
                  <td>{i + 1}</td>
                  <td>{data.point_num}</td>
                  <td>{data.price}</td>
                  <td>
                    <img
                      className="m-auto"
                      src={process.env.REACT_APP_SERVER_ADDRESS + data.img_url}
                      width="50px"
                      height="50px"
                    ></img>
                  </td>
                  <td>
                    <span
                      id={data._id}
                      className="fa fa-edit p-1"
                      onClick={() => {
                        handleEdit(i);
                      }}
                    ></span>
                    <span
                      id={data._id}
                      className="fa fa-remove p-1"
                      onClick={() => {
                        setDelPointId(data._id);
                        setIsModalOpen(true);
                      }}
                    ></span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">There is no Point</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <DeleteConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default Point;
