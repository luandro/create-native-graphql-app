import I18n from 'ex-react-native-i18n';
import en from './en';
import pt from './pt';  

I18n.fallbacks = true;

I18n.translations = {
  en,
  pt,
};

export default I18n; 