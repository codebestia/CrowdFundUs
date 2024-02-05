import './App.css';
import ConnectionContextProvider from './context/ConnectionContext';
import Layout from './components/Layout';
import Router from './navigation/router';

function App() {
  return (
    <div className="App">
      <ConnectionContextProvider>
          <Router />
      </ConnectionContextProvider>
    </div>
  );
}

export default App;
