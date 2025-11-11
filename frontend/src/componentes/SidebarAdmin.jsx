import { Link } from 'react-router-dom';

export default function SidebarAdmin({ abierto, toggle }) {
  return (
    <aside
      className={`fixed top-16 left-0 h-full bg-gray-100 border-r border-gray-300 p-4 transition-all duration-300 ${
        abierto ? 'w-48' : 'w-0 overflow-hidden'
      }`}
    >
      <button
        onClick={toggle}
        className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
      >
        {abierto ? '←' : '→'}
      </button>

      {abierto && (
        <nav className="mt-8 flex flex-col gap-2">
          <Link to="/aulas" className="hover:text-blue-600">Aulas</Link>
          <Link to="/docente" className="hover:text-blue-600">Docentes</Link>
          <Link to="/materia_grupo" className="hover:text-blue-600">Materia y Grupo</Link>
          <Link to="/asignar_horario" className="hover:text-blue-600">Asignar Horario</Link>
          <Link to="/importar_usuarios" className="hover:text-blue-600">Importar Usuarios</Link>
          <Link to="/reporte_asistencia" className="hover:text-blue-600">Reporte</Link>
          <Link to="/administrar_usuario" className="hover:text-blue-600">Administrar Usuarios</Link>
        </nav>
      )}
    </aside>
  );
}
