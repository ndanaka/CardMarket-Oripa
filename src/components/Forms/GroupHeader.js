import React from "react";
import { useTranslation } from "react-i18next";
function GroupHeader({ text }) {
  const {t} = useTranslation();
  return (
    <div className="w-full text-base font-Lexend font-bold text-gray-400 py-2">
      {t(text)}
    </div>
  );
}

export default GroupHeader;
