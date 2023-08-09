import React, { useContext, useEffect } from 'react';
import './Header.scss';
import { LanguageContext } from '../../context/LanguageContext';
export const Header = () => {
  const { userLanguage, changeLanguage } = useContext(LanguageContext);
  const handleLanguageChange = (newLang) => {
    if (userLanguage != newLang) {
      //   console.log('new lang', newLang);
      changeLanguage(newLang);
    }
  };
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  return (
    <header className="header">
      <div className="header-title">3D REACT</div>
      <div className="header-svg">
        <svg
          onClick={handleScrollToTop}
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="10"
          viewBox="0 0 40 10"
          fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M39.9999 0.324707H-6.10352e-05V3.01302H39.9999V0.324707ZM35.3246 6.98703H4.67526V9.67534H35.3246V6.98703Z"
            fill="#323232"
          />
        </svg>
      </div>
      <div className="header-language">
        <span
          onClick={() => handleLanguageChange('en')}
          className={'en-lang ' + (userLanguage === 'en' ? 'selected' : 'unselected')}>
          EN
        </span>
        <span
          onClick={() => handleLanguageChange('ru')}
          className={'ru-lang ' + (userLanguage === 'ru' ? 'selected' : 'unselected')}>
          RU
        </span>
      </div>
    </header>
  );
};
