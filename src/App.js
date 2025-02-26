// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Resume from './pages/Resume';
import Interview from './pages/Interview';
import Result from './pages/Result';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Resume />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/result" element={<Result/> }/>
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  );
}

export default App;