import { createContext, useContext, useState, useCallback } from 'react';
import translations from '../i18n';

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState('es');

  const t = useCallback(
    (key) => translations[lang]?.[key] ?? key,
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
