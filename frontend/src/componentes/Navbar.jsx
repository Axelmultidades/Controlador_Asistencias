import { Link } from 'react-router-dom';
import '../estilos/Navbar.css';

function Navbar({ usuario, onLogout }) {
  return (
    <nav>
      <Link to="/">Inicio</Link> | 

      {usuario && (
        <>
          <Link to="/list_profesor">Profesores</Link> | 
          <Link to="/horario">Horario</Link> | 
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
