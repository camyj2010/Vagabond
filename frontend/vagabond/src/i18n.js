import i18next from "i18next";
import { initReactI18next } from "react-i18next";

//Import all translation files
import English from "./traslation/English.json";
import Spanish from "./traslation/Spanish.json";
import French from "./traslation/French.json";
import Italian from "./traslation/Italian.json";
import German from "./traslation/German.json";
import Portuguese from "./traslation/Portuguese.json";

const resources = {
    en: {
        translation: English,
    },
    es: {
        translation: Spanish,
    },
		fr: {
				translation: French,
		},
		it: {
				translation: Italian,
		},
		de: {
				translation: German,
		},
		pt: {
				translation: Portuguese,
		},
}

i18next.use(initReactI18next)
.init({
  resources,
  lng:"en", //default language
});

export default i18next;