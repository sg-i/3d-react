import React, { createContext, useState, useEffect } from 'react';
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
  const applyGlobalStyles = (primaryColor) => {
    const style = document.createElement('style');
    style.innerHTML = `
      *::-webkit-scrollbar {
        width: 17px;
      }
      *::-webkit-scrollbar-track {
        background: ${primaryColor};
      }
      *::-webkit-scrollbar-thumb {
        border-radius: 14px;
        background: ${textColor};
        border-right: 4px ${primaryColor} solid;
        border-left: 4px ${primaryColor} solid;
      
        border-top: 3px ${primaryColor} solid;
        border-bottom: 3px ${primaryColor} solid;
      }
    `;
    document.head.appendChild(style);
  };
  useEffect(() => {
    console.log(primaryColor, secondColor, textColor, backgroundColor);
    applyGlobalStyles(primaryColor);
  }, [primaryColor, secondColor, textColor, backgroundColor]);

  return (
    <ThemeContext.Provider
      value={{ ChangeColor, primaryColor, backgroundColor, secondColor, textColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeProvider, ThemeContext };
