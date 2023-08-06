import React, { createContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
  const detectedLanguage = localStorage.getItem('userLanguage') || navigator.language.split('-')[0];
  const language = detectedLanguage === 'ru' ? 'ru' : 'en';
  const [userLanguage, setUserLanguage] = useState(language);

  const changeLanguage = (newLanguage) => {
    localStorage.setItem('userLanguage', newLanguage);
    setUserLanguage(newLanguage);
  };
  useEffect(() => {
    console.log(userLanguage);
  }, [userLanguage]);

  return (
    <LanguageContext.Provider value={{ userLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export { LanguageProvider, LanguageContext };
