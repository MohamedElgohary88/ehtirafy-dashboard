import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useLanguageDirection = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isRTL]);

  return isRTL;
};
