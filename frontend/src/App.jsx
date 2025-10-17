import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import List_profesor from './Pages/List_profesor';
import HorarioPage from './Pages/Horario_page';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/list_profesor" element={<List_profesor />} />
        <Route path="/horario" element={<HorarioPage />} />
      </Routes>
    </Router>
  );
}

export default App;
