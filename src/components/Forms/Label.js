import { useTranslation } from "react-i18next";

function Label({ text, classname = "" }) {
  const { t } = useTranslation();

  return (
    <label
      htmlFor="name"
      className={`text-base text-gray-500 text-center font-Lexend ${classname}`}
    >
      {t(text) + ":"}
    </label>
  );
}

export default Label;
