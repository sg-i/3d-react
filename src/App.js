import React, { useState, useRef, useContext } from 'react';
import './App.scss';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Outlet, useLoaderData } from 'react-router-dom';
import { MiniModel } from './components/Header/MiniModel/MiniModel';
import { ThemeContext } from './context/ThemeContext';

export function App() {
  const { data } = useLoaderData();
  const { primaryColor, backgroundColor, secondColor, textColor } = useContext(ThemeContext);

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

  const toggleMenu = () => {
    const headerHeightNow = headerRef.current.clientHeight;
    const screenHeight = window.innerHeight / 3;
    setHeaderPosition(isMenuOn ? 0 : screenHeight - headerHeightNow);
    setHeaderHeight(headerHeightNow);
    setNewWindowHeight(screenHeight - headerHeightNow);
    setIsMenuOn(!isMenuOn);
  };

  const [selectedItem, setSelectedItem] = useState();

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  return (
    <div style={objWithTheme} className="App">
      <div
        className="navbar-menu"
        style={
          isMenuOn
            ? {
                height: `${newWindowHeight}px`,
                color: textColor,
                backgroundColor: primaryColor,
                transition: 'height 0.7s ease-in-out',
              }
            : {
                color: textColor,
                backgroundColor: primaryColor,
                transition: 'height 0.7s ease-in-out',
              }
        }>
        {
          <div className="content">
            {data.map((item) => (
              <MiniModel
                key={item.id}
                id={item.id}
                image={item.images.miniModel}
                name={item.name}
                isSelected={(selectedItem ? selectedItem.id : -1) == item.id}
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
      {<Outlet context={[selectedItem, setSelectedItem]} />}

      <Footer />
    </div>
  );
}
