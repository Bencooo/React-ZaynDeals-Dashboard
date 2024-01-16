import logo from './logo.svg';
import './App.css'; 
import './firebase.config';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default App;
