import logo from './logo.svg';
import React, { useEffect, useState, useRef, useContext } from 'react';
import './App.scss';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Model } from './components/Pages/Model/Model';
import { Link, Outlet, useLoaderData, useNavigate } from 'react-router-dom';
import { getModels } from './loaders/getModels';
import { MiniModel } from './components/Header/MiniModel/MiniModel';
import { ThemeContext, ThemeProvider } from './context/ThemeContext';
import { TestComponent } from './TestComponent/TestComponent';

export function App() {
  const { data } = useLoaderData();
  const { ChangeColor, primaryColor, backgroundColor, secondColor, textColor } =
    useContext(ThemeContext);

  let objWithTheme = {
    '--primaryColor': primaryColor,
    '--backgroundColor': backgroundColor,
    '--secondColor': secondColor,
    '--textColor': textColor,
  };
  const [isMenuOn, setIsMenuOn] = useState(false);
  const [headerPosition, setHeaderPosition] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [newWindowHeight, setNewWindowHeight] = useState(0);
  const headerRef = useRef(null);

  const navigate = useNavigate();
  const toggleMenu = () => {
    console.log(headerRef.current);
    const headerHeightNow = headerRef.current.clientHeight;
    const screenHeight = window.innerHeight / 3;
    setHeaderPosition(isMenuOn ? 0 : screenHeight - headerHeightNow);
    setHeaderHeight(headerHeightNow);
    setNewWindowHeight(screenHeight - headerHeightNow);
    setIsMenuOn(!isMenuOn);
    // document.body.style.overflow = isMenuOn ? 'auto' : 'hidden';
  };

  const [selectedItem, setSelectedItem] = useState(null);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  return (
    <div style={objWithTheme} className="App">
      <div
        style={
          isMenuOn
            ? {
                position: 'fixed',
                overflow: 'hidden',
                top: 0,
                height: `${newWindowHeight}px`,
                color: textColor,
                backgroundColor: primaryColor,
                width: '100%',
                zIndex: 9999,
                transition: 'height 0.7s ease-in-out',
              }
            : {
                position: 'fixed',
                overflow: 'hidden',
                color: textColor,
                top: 0,
                height: '0px',
                backgroundColor: primaryColor,
                width: '100%',
                zIndex: 9999,
                transition: 'height 0.7s ease-in-out',
              }
        }>
        {
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              overflowX: 'auto',
              overflowY: 'hidden',
            }}>
            {data.map((item) => (
              <MiniModel
                key={item.id}
                id={item.id}
                image={item.images.miniModel}
                name={item.name}
                isSelected={selectedItem === item}
                setIsMenuOn={setIsMenuOn}
                onSelect={() => handleSelectItem(item)}
              />
            ))}
          </div>
        }
      </div>
      <Header
        toggleMenu={toggleMenu}
        headerRef={headerRef}
        style={
          isMenuOn ? { top: headerPosition, boxShadow: '0px 7px 34px rgba(0, 0, 0, 0.3)' } : {}
        }
      />
      {<Outlet />}

      <Footer />
    </div>
  );
}
