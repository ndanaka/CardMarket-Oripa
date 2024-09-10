import { useState, useEffect } from "react";

import { setAuthToken } from "../../utils/setHeader";
import api from "../../utils/api";
import ConfirmModal from "../../components/Modals/ConfirmModal";
import { UserAtom } from "../../store/user";
import { useAtom } from "jotai";
import { showToast } from "../../utils/toastUtil";
import UpdateUserData from "../../utils/UpdateUserData";
import { useNavigate } from "react-router-dom";

import Gpay from "../../assets/img/icons/common/google.png";
import ApplePay from "../../assets/img/icons/common/apple.png";
import CustomSelect from "../../components/Forms/CustomSelect";

function PurchasePoint() {
  const [points, setPoints] = useState(null); //registered point list
  const [isOpen, setIsOpen] = useState(false); //modal open flag
  const [paymentMethod, setPaymentMethod] = useState(null); //
  const [selId, setSelId] = useState(0);
  const [user, setUser] = useAtom(UserAtom);
  const navigate = useNavigate();
  console.log("user", user);

  useEffect(() => {
    setAuthToken();
    api
      .get("/admin/get_point")
      .then((res) => {
        setPoints(res.data.points);
      })
      .catch((err) => console.error(err));
  }, []);

  const updateUserData = () => {
    setAuthToken();
    api
      .get(`/user/get_user/${user._id}`)
      .then((res) => {
        if (res.data.status === 1) {
          setUser(res.data.user);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const purchase_point = () => {
    setIsOpen(false);
    setAuthToken();
    console.log("purchase function");
    api
      .post("/user/point/purchase", {
        user_id: user._id,
        point_num: points[selId].point_num,
        price: points[selId].price,
      })
      .then((res) => {
        if (res.data.status === 1) {
          showToast(res.data.msg);
          updateUserData();
        } else showToast(res.data.msg, "error");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const paymentOptions = [
    { value: "gPay", label: "Google Pay", img: Gpay },
    { value: "applePay", label: "Apple Pay", img: ApplePay },
    {
      value: "univa",
      label: "Univa Pay",
      img: "https://via.placeholder.com/20?text=C",
    },
  ];
  return (
    <div className="w-full h-full lg:w-[70%] flex flex-col p-2 mx-auto mt-16">
      <div className="mt-3">
        <i
          className="fa fa-chevron-left float-left"
          onClick={() => navigate("/user/index")}
        ></i>
        <div className="text-center text-3xl text-theme_text_color font-Lexend">
          Purchase Point
        </div>
      </div>
      <hr className="w-full"></hr>

      <div className="flex flex-wrap">
        <div className="p-2 w-full">
          <CustomSelect options={paymentOptions} selectedOption={paymentMethod} setOption={setPaymentMethod}/>
          <div className="flex flex-col justify-between bg-white rounded-lg mt-2">
            <div>
              <div className="p-4 text-center text-lg border-b-[1px] border-b-gray-300">
                What you want
              </div>
            </div>
            <div className="p-4">
              {points
                ? points.map((point, i) => (
                    <div key={i}>
                      <div className="p-2 flex justify-between items-center">
                        <div className="flex">
                          <img
                            src={
                              process.env.REACT_APP_SERVER_ADDRESS +
                              point.img_url
                            }
                            alt="point"
                            width="50px"
                            height="50px"
                          ></img>
                          <div className="flex flex-col px-2">
                            <div className="text-left text-lg">
                              {point.point_num} pt
                            </div>
                            <div className="text-xs text-center text-theme_text_color">
                              at {point.price}
                            </div>
                          </div>
                        </div>
                        <div>
                          <button
                            className="py-1 px-2 bg-indigo-600 rounded-md text-white"
                            onClick={() => {
                              setIsOpen(true); //modal open
                              setSelId(i); //set selected id for api
                            }}
                          >
                            Buy now
                          </button>
                        </div>
                      </div>
                      <hr className="py-1"></hr>
                    </div>
                  ))
                : ""}
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        headerText="Purchase Point"
        bodyText="Are you sure?"
        okBtnClick={purchase_point}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </div>
  );
}

export default PurchasePoint;
