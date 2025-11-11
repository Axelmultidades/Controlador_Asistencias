import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import List_profesor from './Pages/List_profesor';
import HorarioPage from './Pages/Horario_page';
import NavBar from './componentes/Navbar';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import DocentesPage from './Pages/Docente';
import AulasPage from './Pages/Aulas';
import MateriaGrupoPage from './Pages/Materia_Grupo.jsx';
import AsignarHorarioPage from './Pages/AsignarHorario.jsx';
import ImportarUsuarios from './Pages/ImportarUsuarios.jsx';
import AdministrarUsuario from './Pages/AdministrarUsuario.jsx';
import Horario_semanal from './Pages/Horario_semanal.jsx';
import Asistencia from './Pages/Asistencia.jsx';
import RegistrarAsistencia from './componentes/Asistencia/RegistrarAsistencia.jsx';

// Componente reutilizable para proteger rutas por rol
function ProtectedRoute({ usuario, requiredRole, children }) {
  if (!usuario || !usuario.roles) {
    console.log('Usuario no autenticado o sin roles');
    return <Navigate to="/" />;
  }

  console.log('Roles del usuario:', usuario.roles);
  const tieneAcceso = usuario.roles.includes(requiredRole);
  console.log('¿Tiene acceso?', tieneAcceso);

  return tieneAcceso ? children : <Navigate to="/" />;
}

function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
    setCargandoSesion(false);
  }, []);

  const handleLogin = (user) => {
    setUsuario(user);
    localStorage.setItem('usuario', JSON.stringify(user));
  };

  const handleLogout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  if (cargandoSesion) {
    return <div className="text-center py-10">Cargando sesión...</div>;
  }

  return (
    <Router>
      <NavBar usuario={usuario} setUsuario={setUsuario} onLogout={handleLogout} />
      <Routes>
        {/* Página principal pública */}
        <Route path="/" element={<Home />} />
        <Route path="/aulas" element={<AulasPage />} />
        <Route path="/materia_grupo" element={<MateriaGrupoPage />} />
        <Route path="/asignar_horario" element={<AsignarHorarioPage />} />
        <Route path="/importar_usuarios" element={<ImportarUsuarios />} />
        <Route path="/administrar_usuario" element={<AdministrarUsuario />} />
        <Route path="/registrar_asistencia" element={<RegistrarAsistencia usuario={usuario}  />} />

        {/* Rutas protegidas por rol */}
        <Route
          path="/docente"
          element={
            <ProtectedRoute usuario={usuario} requiredRole="profesor">
              <DocentesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/horario_semanal"
          element={
            <ProtectedRoute usuario={usuario} requiredRole="profesor">
              <Horario_semanal usuario={usuario} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/asistencia"
          element={
            <ProtectedRoute usuario={usuario} requiredRole="profesor">
              <Asistencia />
            </ProtectedRoute>
          }
        />
        

        {/* Login y registro: accesibles solo si no hay sesión */}
        <Route
          path="/login"
          element={
            usuario ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/register"
          element={
            usuario ? <Navigate to="/" /> : <Register />
          }
        />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
