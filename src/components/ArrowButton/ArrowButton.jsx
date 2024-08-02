import { useContext } from 'react';
import './ArrowButton.style.scss';
import { ThemeContext } from '../../context/ThemeContext';

export const ArrowButton = ({ rotate, side }) => {
  const theme = useContext(ThemeContext);
  // console.log(theme);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // плавная прокрутка
    });
  };
  return (
    <div
      onClick={scrollToTop}
      className="arrow-button"
      style={{
        position: 'fixed',
        transform: `rotate(${rotate}deg)`,
        top: '45%',
        width: 80,
        [side]: 10,
      }}>
      <svg
        width="80px"
        height="80px"
        viewBox="0 0 24 24"
        fill={theme.textColor}
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6 12H18M18 12L13 7M18 12L13 17"
          stroke={theme.textColor}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
};
