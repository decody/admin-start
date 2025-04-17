import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className={`px-2 py-1 text-sm rounded ${
          i18n.language === "ko"
            ? "bg-indigo-600 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
        onClick={() => changeLanguage("ko")}
      >
        {t("language.ko")}
      </button>
      <button
        className={`px-2 py-1 text-sm rounded ${
          i18n.language === "en"
            ? "bg-indigo-600 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
        onClick={() => changeLanguage("en")}
      >
        {t("language.en")}
      </button>
      <button
        className={`px-2 py-1 text-sm rounded ${
          i18n.language === "zh"
            ? "bg-indigo-600 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
        onClick={() => changeLanguage("zh")}
      >
        {t("language.zh")}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
