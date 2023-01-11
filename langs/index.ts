import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import { en } from "./en";
import { es } from "./es";

export const translations = { en, es };

export type AppTranslations = keyof typeof translations.es;

const i18n = new I18n(translations);
i18n.locale = getLocales()[0].languageCode;
i18n.enableFallback = true;

export const traduct = (name: AppTranslations) => i18n.t(name);
