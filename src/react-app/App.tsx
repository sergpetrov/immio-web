// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Terms from './Terms';

function MainPage() {
  return (
    <div>
      <h1>Immio Mobile App</h1>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </Router>
  );
}

export default App;
