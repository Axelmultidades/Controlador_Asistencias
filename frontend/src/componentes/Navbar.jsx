import { Link } from 'react-router-dom';

function Navbar({ usuario, onLogout }) {
  return (
    <nav className="flex flex-wrap items-center justify-center gap-4 p-4 bg-green-100 border-b border-gray-300 text-sm md:text-base">
      <Link
        to="/"
        className="text-gray-800 font-semibold px-3 py-1 rounded hover:bg-gray-300 transition whitespace-nowrap"
      >
        Inicio
      </Link>

      {usuario ? (
        <>
          <Link
            to="/aulas"
            className="text-gray-800 font-semibold px-3 py-1 rounded hover:bg-gray-300 transition whitespace-nowrap"
          >
            Aulas
          </Link>
          <Link
            to="/docente"
            className="text-gray-800 font-semibold px-3 py-1 rounded hover:bg-gray-300 transition whitespace-nowrap"
          >
            Docentes
          </Link>
          <Link
            to="/materia_grupo"
            className="text-gray-800 font-semibold px-3 py-1 rounded hover:bg-gray-300 transition whitespace-nowrap"
          >
            Materia y Grupo
          </Link>
          <Link
            to="/asignar_horario"
            className="text-gray-800 font-semibold px-3 py-1 rounded hover:bg-gray-300 transition whitespace-nowrap"
          >
            Asignar Horario
          </Link>
          <span className="text-gray-700 font-medium whitespace-nowrap">
            Bienvenido, {usuario.username}
          </span>
          <button
            onClick={onLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition whitespace-nowrap"
          >
            Cerrar sesión
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="text-gray-800 font-semibold px-3 py-1 rounded hover:bg-gray-300 transition whitespace-nowrap"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="text-gray-800 font-semibold px-3 py-1 rounded hover:bg-gray-300 transition whitespace-nowrap"
          >
            Registrarse
          </Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
