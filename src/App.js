import logo from './logo.svg';
import './App.css';
import Main from './components/Main';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <Main />
      </div>
    </LanguageProvider>
  );
}

export default App;
