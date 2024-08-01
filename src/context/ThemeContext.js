import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useUpdateEffect } from 'react-use';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState('#fbfe74');
  const [backgroundColor, setBackgroundColor] = useState('#fbfe74');
  const [secondColor, setSecondColor] = useState('rgba(255, 166, 41, 0.443)');
  const [textColor, setTextColor] = useState('black');

  const ChangeColor = (type, color) => {
    switch (type) {
      case 'primary':
        setPrimaryColor(color);
        break;
      case 'background':
        setBackgroundColor(color);
        break;
      case 'second':
        setSecondColor(color);
        break;
      case 'text':
        setTextColor(color);
        break;
      default:
        break;
    }
  };
  const applyGlobalStyles = useCallback(
    (primaryColor) => {
      const existingStyle = document.getElementById('custom-scrollbar-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
      // Создаём новые стили
      const style = document.createElement('style');
      style.id = 'custom-scrollbar-styles';
      style.innerHTML = `
        *::-webkit-scrollbar {
          width: 17px;
        }
        *::-webkit-scrollbar-track {
          background: ${primaryColor};
          transition: background 0.4s ease-in-out;
        }
        *::-webkit-scrollbar-thumb {
          border-radius: 14px;
          background: ${textColor};
          transition: background 0.4s ease-in-out, border-left 0.4s ease-in-out, border-right 0.4s ease-in-out, border-top 0.4s ease-in-out, border-bottom 0.4s ease-in-out;
          border-right: 4px ${primaryColor} solid;
          border-left: 4px ${primaryColor} solid;
        
          border-top: 3px ${primaryColor} solid;
          border-bottom: 3px ${primaryColor} solid;
        }
      `;
      document.head.appendChild(style);
      // Принудительное обновление стилей
      const refreshScrollbars = () => {
        document.body.classList.add('refresh-scrollbars');
        setTimeout(() => {
          document.body.classList.remove('refresh-scrollbars');
        }, 10);
      };
      refreshScrollbars();
    },
    [textColor, primaryColor],
  );
  useEffect(() => {
    console.log(primaryColor, secondColor, textColor, backgroundColor);
    applyGlobalStyles(primaryColor);
  }, [primaryColor, secondColor, textColor, backgroundColor, applyGlobalStyles]);

  return (
    <ThemeContext.Provider
      value={{ ChangeColor, primaryColor, backgroundColor, secondColor, textColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeProvider, ThemeContext };
