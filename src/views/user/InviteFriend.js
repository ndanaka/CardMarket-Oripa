import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";

import usePersistedUser from "../../store/usePersistedUser.js";
import { bgColorAtom } from "../../store/theme.js";

const InviteFriend = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user] = usePersistedUser();
  const [bgColor] = useAtom(bgColorAtom);

  const [link, setLink] = useState("");
  const [copiedLink, setCopiedLink] = useState("");

  const generateLink = () => {
    const baseLink = process.env.REACT_APP_FRONT_ADDRESS + "user/index";

    const timestamp = Date.now();
    const linkInfo = `${baseLink}?user_id=${
      user._id
    }&first=${true}&${timestamp}`;

    setLink(linkInfo);
  };

  const handleCopy = () => {
    setCopiedLink(link);

    const tempInput = document.createElement("input");
    tempInput.value = link;
    document.body.appendChild(tempInput);
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand("copy");
    document.body.removeChild(tempInput);

    //3s later non display of "copied"
    setTimeout(() => {
      setCopiedLink("");
    }, 3000);
  };

  return (
    <div className="flex flex-grow">
      <div className={`relative w-full lg:w-2/3 mx-auto p-3`}>
        <div className="w-full py-2">
          <div className="text-center text-xl text-slate-600">
            <i
              className="fa fa-chevron-left mt-1.5 float-left items-center cursor-pointer"
              onClick={() => navigate(-1)}
            ></i>
            {t("inviteFriend")}
          </div>
          <hr className="w-full my-2"></hr>
          <div className="w-full rounded-lg bg-white mt-3 p-2">
            <p className="w-full text-2xl text-center text-theme_headertext_color">
              {t("inviteTitle")}
            </p>
            <p className="p-2">
              {t(
                "inviteDesc"
              )}
            </p>
            <div className="flex flex-wrap w-full justify-between px-2 pt-2">
              <button
                className="hover:opacity-50 px-4 py-2 my-1 rounded-md text-white"
                style={{ backgroundColor: bgColor }}
                onClick={generateLink}
              >
                {t("generateLink")}
              </button>
            </div>
            <div className="flex flex-wrap justify-between w-full px-2">
              <input
                type="text"
                className="cursor-not-allowed block p-2 mt-2 text-slate-700 bg-white border rounded-md focus:border-slate-400 focus:ring-slate-300 focus:outline-none focus:ring focus:ring-opacity-40 flex-grow"
                defaultValue={link}
                readOnly={true}
              />
              <div
                className="flex items-center justify-center w-16 cursor-pointer" // Set a fixed width for the button
                data-tooltip-id="copy"
                data-tooltip-content={`${
                  copiedLink === "" ? t("copyLink") : t("copied")
                }`}
                onClick={() => handleCopy()}
              >
                {copiedLink !== "" ? (
                  <i className="fa fa-check" />
                ) : (
                  <i className="far fa-copy text-[20px] cursor-pointer" />
                )}
                <Tooltip id="copy" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteFriend;
