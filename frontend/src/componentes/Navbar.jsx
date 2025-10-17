import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/list_profesor">Profesores</Link> | 
      <Link to="/horario">Horario</Link>
    </nav>
  );
}
export default Navbar;