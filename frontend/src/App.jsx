import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import List_profesor from './Pages/List_profesor';
import HorarioPage from './Pages/Horario_page';
import NavBar from './componentes/Navbar';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (user) => {
    setUsuario(user);
    localStorage.setItem('usuario', JSON.stringify(user));
  };

  const handleLogout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  return (
    <Router>
      <NavBar usuario={usuario} setUsuario={setUsuario} onLogout={handleLogout} />
      <Routes>
        {/* Página principal pública */}
        <Route path="/" element={<Home />} />

        {/* Login y registro: accesibles solo si no hay sesión */}
        <Route
          path="/login"
          element={
            usuario ? <Navigate to="/list_profesor" /> : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/register"
          element={
            usuario ? <Navigate to="/list_profesor" /> : <Register />
          }
        />

        {/* Rutas protegidas */}
        <Route
          path="/list_profesor"
          element={
            usuario ? <List_profesor /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/horario"
          element={
            usuario ? <HorarioPage ci={usuario.id} /> : <Navigate to="/login" />
          }
        />

        {/* Ruta no encontrada */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
