import React from 'react';
import { getModels } from '../../../loaders/getModels';
import './Home.style.scss';
import { Link, useLoaderData } from 'react-router-dom';
export async function loader() {
  const models = await getModels();
  return { models };
}
export const Home = () => {
  const { models } = useLoaderData();
  return (
    <div className="home">
      {models.map((elem) => {
        return (
          <Link to={`/models/${elem.id}`}>
            <div>{elem.name}</div>
          </Link>
        );
      })}
    </div>
  );
};
