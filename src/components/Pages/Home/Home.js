import React, { useContext, useEffect } from 'react';
import { getModels } from '../../../loaders/getModels';
import './Home.style.scss';
import { Link, useLoaderData } from 'react-router-dom';
import { MiniModel } from '../../Header/MiniModel/MiniModel';
import { ThemeContext } from '../../../context/ThemeContext';
import { AnimatedBackground } from '../../AnimatedBackground/AnimatedBackground';
export async function loader() {
  const models = await getModels();
  return { models };
}
export const Home = () => {
  const { textColor, ChangeColor } = useContext(ThemeContext);
  const { models } = useLoaderData();
  console.log(models);
  useEffect(() => {
    //theme
    // ChangeColor('primary', '#00ABE1');
    // ChangeColor('background', '#00ABE1');
    // ChangeColor('second', '#00ABE1');
    // ChangeColor('text', '#161F6D');
    ChangeColor('primary', '#222222');
    ChangeColor('background');
    ChangeColor('second', 'gray');
    ChangeColor('text', 'orange');
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
    </AnimatedBackground>
  );
};
