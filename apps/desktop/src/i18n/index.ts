import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import faCommon from "./locales/fa/common.json";
import enCommon from "./locales/en/common.json";

export const defaultNS = "common";
export const resources = {
  "fa-IR": {
    common: faCommon,
  },
  "en-US": {
    common: enCommon,
  },
} as const;

i18n
  .use(initReactI18next)
  .init({
    lng: "fa-IR",
    fallbackLng: "fa-IR",
    ns: ["common"],
    defaultNS,
    resources,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
