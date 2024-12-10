import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Raffle from './pages/Raffle';
import UploadNames from './pages/UploadNames';
import WinnerList from './pages/WinnerList';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Raffle />} /> {/* Raffle Page */}
        <Route path="/upload-names" element={<UploadNames />} /> {/* Upload Names Page */}
        <Route path="/winner" element={<WinnerList />} /> {/* Winner List Page */}
      </Routes>
    </Router>
  );
}

export default App;
