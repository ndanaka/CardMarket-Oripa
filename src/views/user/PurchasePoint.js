import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";
import { setAuthToken } from "../../utils/setHeader";
import UpdateUserData from "../../utils/UpdateUserData";

import ConfirmModal from "../../components/Modals/ConfirmModal";
import GooglePayCheckModal from "../../components/Modals/GooglePayCheckModal";
import CustomSelect from "../../components/Forms/CustomSelect";

import Gpay from "../../assets/img/icons/common/google.png";
import ApplePay from "../../assets/img/icons/common/apple.png";
import Univa from "../../assets/img/icons/common/univa.png";

import { UserAtom } from "../../store/user";
import usePersistedUser from "../../store/usePersistedUser";

function PurchasePoint() {
  const paymentOptions = [
    { value: "gPay", label: "Google Pay", img: Gpay },
    { value: "applePay", label: "Apple Pay", img: ApplePay },
    { value: "univaPay", label: "Univa Pay", img: Univa },
  ];

  const [points, setPoints] = useState(null); //registered point list
  const [isOpen, setIsOpen] = useState(false); //modal open flag
  const [paymentMethod, setPaymentMethod] = useState(null); //
  const [selId, setSelId] = useState(0);
  const [paymentRequest, setPaymentRequest] = useState({
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: "CARD",
        parameters: {
          allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
          allowedCardNetworks: ["MASTERCARD", "VISA"],
        },
        tokenizationSpecification: {
          type: "PAYMENT_GATEWAY",
          parameters: {
            gateway: "example",
            gatewayMerchantId: "exampleGatewayMerchantId",
          },
        },
      },
    ],
    merchantInfo: {
      merchantId: "12345678901234567890",
      merchantName: "Demo Merchant",
    },
    transactionInfo: {
      totalPriceStatus: "FINAL",
      totalPriceLabel: "Total",
      totalPrice: "100.00",
      currencyCode: "USD",
      countryCode: "US",
    },
  });

  const [user, setUser] = usePersistedUser();
  const navigate = useNavigate();

  useEffect(() => {
    setAuthToken();
    api
      .get("/admin/get_point")
      .then((res) => {
        setPoints(res.data.points);
      })
      .catch((err) => console.error(err));
  }, []);

  const handlePay = (amount) => {
    if (paymentMethod === null) {
      showToast("Select method of payment", "error");
      return;
    }

    switch (paymentMethod.value) {
      case "gPay":
        const newPaymentRequest = {
          ...paymentRequest,
          // Update the payment request as needed
        };
        console.log(newPaymentRequest);
        setPaymentRequest(newPaymentRequest);

        break;

      case "applePay":
        console.log("apple pay");

        break;

      case "univaPay":
        console.log("univa pay");

        break;

      default:
        break;
    }

    console.log(amount);
  };

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

  return (
    <div className="w-full h-full lg:w-[70%] flex flex-col p-2 mx-auto mt-20">
      <div className="mt-3">
        <i
          className="fa fa-chevron-left float-left mt-2.5 font-bold cursor-pointer"
          onClick={() => navigate("/user/index")}
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
          <div className="flex flex-col justify-between bg-white rounded-lg mt-2">
            <div>
              <div className="text-lg mt-3 mb-1 font-bold">Charge amount</div>
            </div>
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
                              {point.point_num} pt
                            </div>
                            <div className="text-s text-center text-theme_text_color">
                              Purchase at ¥{point.price}
                            </div>
                          </div>
                        </div>
                        <div>
                          <button
                            className="py-2 px-3 bg-indigo-600 rounded-md text-white text-lg font-bold"
                            onClick={() => {
                              // setIsOpen(true); //modal open
                              // setSelId(i); //set selected id for api
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
      {/* <GooglePayCheckModal isOpen={isOpen} setIsOpen={setIsOpen} /> */}
    </div>
  );
}

export default PurchasePoint;
