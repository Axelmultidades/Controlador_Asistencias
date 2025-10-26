import { Link } from 'react-router-dom';
import '../estilos/Navbar.css';

function Navbar({ usuario, onLogout }) {
  return (
    <nav>
      <Link to="/">Inicio</Link> | 

      {usuario && (
        <>
          <Link to="/aulas">Aulas</Link>
          <Link to="/docente">Docentes</Link>
          <Link to="/materia_grupo">Materia y Grupo</Link>
          <Link to="/asignar_horario">Asignar Horario</Link> |
          <span>Bienvenido, {usuario.username}</span> | 
          <button onClick={onLogout}>Cerrar sesión</button>
        </>
      )}

      {!usuario && (
        <>
          <Link to="/login">Iniciar sesión</Link> | 
          <Link to="/register">Registrarse</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
