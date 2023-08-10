import logo from './logo.svg';
import React, { useEffect, useState } from 'react';
import './App.scss';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Model } from './components/Pages/Model/Model';
import { Link, Outlet, useLoaderData } from 'react-router-dom';
import { getModels } from './loaders/getModels';

export async function loader() {
  const models = await getModels();
  return { models };
}

export function App() {
  // const [models, setmodels] = useState(null);

  // useEffect(() => {
  //   fetch('http://localhost:3001/models')
  //     .then((response) => response.json())
  //     .then((models) => {
  //       console.log(models);
  //       setmodels(models);
  //     })
  //     .catch((error) => console.error('Error:', error));
  // }, []);
  const { models } = useLoaderData();
  // console.log(models);
  return (
    <LanguageProvider>
      <div className="App">
        <Header />
        <Outlet />
        {/* {models &&
          models.map((model) => {
            return <Model data={model} />;
          })} */}
        {/* {models.length ? (
          models.map((elem) => {
            return <div>{elem.name}</div>;
          })
        ) : (
          <div>Нет моделей</div>
        )} */}
        <Footer />
      </div>
    </LanguageProvider>
  );
}
