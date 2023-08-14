import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import './fonts/tt/TTHoves-Medium.ttf';
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import ErrorPage from './routes/ErrorPage';
import { Model, loader as modelLoader } from './components/Pages/Model/Model';
import { Home, loader as modelsLoader } from './components/Pages/Home/Home';
import { getModels } from './loaders/getModels';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeContext, ThemeProvider } from './context/ThemeContext';
const root = ReactDOM.createRoot(document.getElementById('root'));

const detectedLanguage = navigator.language.split('-')[0];
const language = detectedLanguage === 'ru' ? 'ru' : 'en';
localStorage.setItem('userLanguage', language);
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    loader: async ({ request }) => {
      const url = new URL(request.url);
      console.log(url.pathname);
      if (url.pathname === '/') {
        return redirect('home');
      } else {
        const data = await getModels();
        console.log(data);
        return { data };
      }
    },
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'models/:modelId',
        element: <Model />,
        loader: modelLoader,
      },
      {
        path: 'home',
        loader: modelsLoader,
        element: <Home />,
      },
    ],
  },
]);

root.render(
  <LanguageProvider>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </LanguageProvider>,
);

reportWebVitals();
