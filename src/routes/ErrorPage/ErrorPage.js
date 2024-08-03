import { useRouteError } from 'react-router-dom';
import './ErrorPage.style.scss';
export default function ErrorPage() {
  const error = useRouteError();
  return (
    <div className="error-page" id="error-page">
      <div className="content">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          Status: <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </div>
  );
}
