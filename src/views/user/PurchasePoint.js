import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";
import { setAuthToken } from "../../utils/setHeader";
import { googlePayConfig } from "../../payment/googlePayConfig";
import { initiateUnivaPayTransaction } from "../../payment/univaPayRequest";

import ConfirmModal from "../../components/Modals/ConfirmModal";
import CustomSelect from "../../components/Forms/CustomSelect";

import Gpay from "../../assets/img/icons/common/google.png";
import ApplePay from "../../assets/img/icons/common/apple.png";
import Univa from "../../assets/img/icons/common/univa.png";

import usePersistedUser from "../../store/usePersistedUser";
import formatPrice from "../../utils/formatPrice";

function PurchasePoint() {
  const paymentOptions = [
    { value: "gPay", label: "Google Pay", img: Gpay },
    { value: "applePay", label: "Apple Pay", img: ApplePay },
    { value: "univaPay", label: "Univa Pay", img: Univa },
  ];
  const [, setGPayReady] = useState(false);

  const [points, setPoints] = useState(null); //registered point list
  const [isOpen, setIsOpen] = useState(false); //modal open flag
  const [paymentMethod, setPaymentMethod] = useState(null); //
  const [, setSelId] = useState(0);

  const [user, setUser] = usePersistedUser();
  const navigate = useNavigate();

  useEffect(() => {
    setAuthToken();
    getPoints();

    // google pay settings
    const script = document.createElement("script");
    script.src = "https://pay.google.com/gp/p/js/pay.js";
    script.onload = onGooglePayLoaded;
    document.body.appendChild(script);
  }, []);

  const updateUserData = () => {
    setAuthToken();
    if (user) {
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
    }
  };

  const getPoints = async () => {
    try {
      const res = await api.get("/admin/get_point");
      setPoints(res.data.points);
    } catch (error) {
      console.log(error);
    }
  };

  const purchase_point = async (amount) => {
    try {
      setAuthToken();

      const res = await api.post("/user/point/purchase", {
        user_id: user._id,
        point_num: amount,
        price: amount,
        email: user.email,
      });

      if (res.data.status === 1) {
        showToast(res.data.msg, "success");
        updateUserData();
      } else showToast(res.data.msg, "error");
    } catch (error) {
      console.log(error);
    }
  };

  const onGooglePayLoaded = () => {
    if (window.google) {
      const paymentsClient = new window.google.payments.api.PaymentsClient({
        environment: googlePayConfig.environment,
      });

      paymentsClient
        .isReadyToPay({
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods:
            googlePayConfig.paymentDataRequest.allowedPaymentMethods,
        })
        .then((response) => {
          if (response.result) {
            setGPayReady(true);
          }
        })
        .catch((err) => {
          console.error("Error loading Google Pay:", err);
        });
    }
  };

  const handlePay = async (amount) => {
    try {
      if (paymentMethod === null) {
        showToast("Select method of payment", "error");
        return;
      }

      switch (paymentMethod.value) {
        case "gPay":
          const paymentsClient = new window.google.payments.api.PaymentsClient({
            environment: googlePayConfig.environment,
          });

          const paymentDataRequest = {
            ...googlePayConfig.paymentDataRequest,
            transactionInfo: {
              ...googlePayConfig.paymentDataRequest.transactionInfo,
              totalPrice: amount.toString(),
            },
          };

          const paymentData = await paymentsClient.loadPaymentData(
            paymentDataRequest
          );
          if (paymentData) {
            await purchase_point(amount);
          }

          break;

        case "applePay":
          console.log("apple pay");

          break;

        case "univaPay":
          try {
            await initiateUnivaPayTransaction(amount);
            alert("Payment initiated successfully");
          } catch (error) {
            console.error("Payment failed", error);
            alert("Payment failed");
          }
          console.log("univa pay");

          break;

        default:
          break;
      }
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  return (
    <div className="flex flex-grow">
      <div className="w-full h-full lg:w-[70%] flex flex-col p-2 mx-auto mt-20">
        <div className="mt-3">
          <i
            className="fa fa-chevron-left float-left mt-2.5 font-bold cursor-pointer"
            onClick={() => navigate(-1)}
          ></i>
          <div className="text-center text-3xl text-theme_text_color font-bold">
            Purchase Point
          </div>
        </div>
        <hr className="w-full"></hr>

        <div className="flex flex-wrap">
          <div className="p-2 w-full">
            <div className="text-lg mt-3 mb-1 font-bold">Method of payment</div>
            <CustomSelect
              options={paymentOptions}
              selectedOption={paymentMethod}
              setOption={setPaymentMethod}
            />
            <div>
              <div className="text-lg mt-3 mb-1 font-bold">Charge amount</div>
            </div>
            <div className="flex flex-col justify-between bg-white rounded-lg mt-2">
              <div className="p-1">
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
                              <div className="text-left text-lg font-bold">
                                {formatPrice(point.point_num)} pt
                              </div>
                              <div className="text-s text-center text-theme_text_color">
                                Purchase at ¥ {formatPrice(point.price)}
                              </div>
                            </div>
                          </div>
                          <div>
                            <button
                              className="py-2 px-3 bg-indigo-600 rounded-md text-white text-lg font-bold"
                              onClick={() => {
                                // setIsOpen(true); //modal open
                                setSelId(i); //set selected id for api
                                handlePay(point.price);
                              }}
                            >
                              Buy Now
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
    </div>
  );
}

export default PurchasePoint;
