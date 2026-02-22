import { useTranslation } from 'react-i18next';

export const useLocalizedData = () => {
  const { i18n, t } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  const getField = (obj, fieldName) => {
    if (!obj) return '';
    if (isEn && obj[`${fieldName}_en`]) return obj[`${fieldName}_en`];
    return obj[fieldName] || '';
  };

  const getCategoryText = (category) => t(`enums.cat.${category}`, t('enums.cat.other'));
  const getDamageText = (damage) => t(`enums.dmg.${damage}`, t('enums.dmg.destroyed'));

  return { getField, getCategoryText, getDamageText, isEn, t };
};