import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LogoutButton({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/api/logout', {}, {
        withCredentials: true
      });

      // Limpia el estado del usuario
      onLogout(); // o setUsuario(null)
      localStorage.removeItem('usuario'); // si lo guardás ahí

      // Redirige al login
      navigate('/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  return (
    <button onClick={handleLogout}>
      Cerrar sesión
    </button>
  );
}

export default LogoutButton;
