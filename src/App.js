import './App.css';
import { StrictMode } from 'react';
import DynamicTreeGrid from './Something';

function App() {
  return (
    <div className="App">
      <StrictMode>
        <DynamicTreeGrid/>
      </StrictMode>
    </div>
  );
}

export default App;
