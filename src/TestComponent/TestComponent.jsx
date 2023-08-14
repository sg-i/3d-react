import React, { useContext } from 'react';
import './TestComponent.style.scss';
import { ThemeContext } from '../context/ThemeContext';
export const TestComponent = () => {
  const { testColor } = useContext(ThemeContext);
  function PrintColor() {
    console.log(testColor);
  }
  const style = { '--testColor': testColor };
  return (
    <button style={style} onClick={PrintColor} className="test-button">
      Color
    </button>
  );
};
