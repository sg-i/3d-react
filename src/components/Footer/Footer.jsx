import React, { useContext } from 'react';
import './Footer.style.scss';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../../context/LanguageContext';
export const Footer = () => {
  const { userLanguage } = useContext(LanguageContext);

  return (
    <footer className="footer">
      <div className="footer-wrap">
        <Link to="https://github.com/sg-i" target="_blank" rel="noopener noreferrer">
          <div className="element">{userLanguage === 'ru' ? 'Портфолио' : 'Portfolio'}</div>
        </Link>
        <Link to="https://github.com/sg-i" target="_blank" rel="noopener noreferrer">
          <div className="element">GitHub</div>
        </Link>
      </div>
    </footer>
  );
};
