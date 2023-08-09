import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App, loader as modelsLoader } from './App';
import reportWebVitals from './reportWebVitals';
import './fonts/tt/TTHoves-Medium.ttf';
// import { Root} from './routes/Root';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './routes/ErrorPage';
import { Model, loader as modelLoader } from './components/Pages/Model/Model';
const root = ReactDOM.createRoot(document.getElementById('root'));

const detectedLanguage = navigator.language.split('-')[0];
const language = detectedLanguage === 'ru' ? 'ru' : 'en';
localStorage.setItem('userLanguage', language);
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    loader: modelsLoader,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'models/:modelId',
        element: <Model />,
        loader: modelLoader,
      },
    ],
  },
]);

root.render(
  // <React.StrictMode>
  // <App />,
  <RouterProvider router={router} />,
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
