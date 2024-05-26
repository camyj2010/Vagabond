import i18next from "i18next";
import { initReactI18next } from "react-i18next";

//Import all translation files
import English from "./traslation/English.json";
import Spanish from "./traslation/Spanish.json";

const resources = {
    en: {
        translation: English,
    },
    es: {
        translation: Spanish,
    },
}

i18next.use(initReactI18next)
.init({
  resources,
  lng:"en", //default language
});

export default i18next;