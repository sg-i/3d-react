import React, { useContext, useEffect } from 'react';
import { getModels } from '../../../loaders/getModels';
import './Home.style.scss';
import { Link, useLoaderData, useOutletContext } from 'react-router-dom';
import { MiniModel } from '../../Header/MiniModel/MiniModel';
import { ThemeContext } from '../../../context/ThemeContext';
import { AnimatedBackground } from '../../AnimatedBackground/AnimatedBackground';
import { LanguageContext } from '../../../context/LanguageContext';
export async function loader() {
  const models = await getModels();
  return { models };
}
export const Home = () => {
  const [selectedItem, setSelectedItem] = useOutletContext();
  const { textColor, ChangeColor } = useContext(ThemeContext);
  const { userLanguage } = useContext(LanguageContext);
  const { models } = useLoaderData();
  console.log(models);
  useEffect(() => {
    //theme
    // ChangeColor('primary', '#00ABE1');
    // ChangeColor('background', '#00ABE1');
    // ChangeColor('second', '#00ABE1');
    // ChangeColor('text', '#161F6D');
    ChangeColor('primary', '#222222');
    ChangeColor('background', 'orange');
    ChangeColor('second', 'gray');
    ChangeColor('text', 'orange');
    setSelectedItem();
  }, []);
  return (
    <AnimatedBackground>
      <div className="home">
        {/* {models.map((elem) => {
        return (
          <Link to={`/models/${elem.id}`}>
            <div>{elem.name}</div>
          </Link>
          
        );
      })} */}

        <div style={{ color: textColor }} className="wrap">
          {models.map((item) => (
            <MiniModel
              key={item.id}
              id={item.id}
              image={item.images.miniModel}
              name={item.name}
              isSelected={false}
              setIsMenuOn={() => {}}
              onSelect={() => {}}
            />
          ))}
        </div>
      </div>
      <div style={{ color: textColor }} className="buttons">
        <Link to="https://github.com/sg-i" target="_blank" rel="noopener noreferrer">
          <div className="element">{userLanguage === 'ru' ? 'Портфолио' : 'Portfolio'}</div>
        </Link>
        <Link to="https://github.com/sg-i" target="_blank" rel="noopener noreferrer">
          <div className="element">GitHub</div>
        </Link>
      </div>
    </AnimatedBackground>
  );
};
