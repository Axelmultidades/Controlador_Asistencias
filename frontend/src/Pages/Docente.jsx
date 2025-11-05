import { useEffect, useState } from 'react';
import RegistroDocente from '../componentes/RegistroDocente.jsx';

export default function DocentesPage() {
  const [docentes, setDocentes] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchDocentes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/profesor?buscar=${buscar}&page=${page}`);
      const data = await res.json();
      setDocentes(data.data.data);
      setLastPage(data.data.last_page);
    } catch (error) {
      console.error('Error al cargar docentes:', error);
      alert('Hubo un problema al cargar los docentes.');
    }
  };

  useEffect(() => {
    fetchDocentes();
  }, [buscar, page]);

  const handleBuscar = (e) => {
    setBuscar(e.target.value);
    setPage(1);
  };

  const verMaterias = async (ci) => {
    try {
      const res = await fetch(`${API_URL}/api/profesor/${ci}/materias`);
      const data = await res.json();

      if (data.success && data.data.length > 0) {
        const nombreDocente = data.data[0].docente;
        alert(`Materias de ${nombreDocente}:\n` + data.data.map(m => `• ${m.nombre}`).join('\n'));
      } else {
        alert(`El docente con CI ${ci} no tiene materias asignadas.`);
      }
    } catch (error) {
      console.error('Error al cargar materias:', error);
      alert('No se pudieron cargar las materias del docente.');
    }
  };

  const eliminarDocente = async (ci) => {
    if (!confirm(`¿Seguro que deseas eliminar al docente con CI ${ci}?`)) return;

    try {
      const res = await fetch(`${API_URL}/api/profesor/${ci}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        alert('Docente eliminado correctamente');
        fetchDocentes();
      } else {
        alert(data.message || 'No se pudo eliminar el docente');
      }
    } catch (error) {
      console.error('Error al eliminar docente:', error);
      alert('Error al eliminar el docente');
    }
  };

  const editarDocente = async (docente) => {
    const nuevoNombre = prompt('Nuevo nombre:', docente.nombre);
    const nuevoTelefono = prompt('Nuevo teléfono (dejar vacío para eliminar):', docente.telefono ?? '');

    if (!nuevoNombre) return;

    const telefonoFinal = nuevoTelefono === '' ? null : parseInt(nuevoTelefono);

    try {
      const res = await fetch(`${API_URL}/api/profesor/${docente.ci}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ci: docente.ci,
          nombre: nuevoNombre,
          telefono: telefonoFinal,
        }),
      });
      const data = await res.json();

      if (data.success) {
        alert('Docente actualizado correctamente');
        fetchDocentes();
      } else {
        alert(data.message || 'No se pudo actualizar el docente');
      }
    } catch (error) {
      console.error('Error al editar docente:', error);
      alert('Error al actualizar el docente');
    }
  };

  return (
  <div className="p-4 md:p-8">
    <h2 className="text-2xl font-bold mb-6">📚 Gestión de Docentes</h2>

    <RegistroDocente onRegistroExitoso={fetchDocentes} />

    <input
      type="text"
      placeholder="Buscar por nombre o CI..."
      value={buscar}
      onChange={handleBuscar}
      className="border rounded px-3 py-2 w-full max-w-md mb-4"
    />

    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">CI</th>
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Teléfono</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {docentes.map((d) => (
            <tr key={d.ci} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{d.ci}</td>
              <td className="border px-4 py-2">{d.nombre}</td>
              <td className="border px-4 py-2">{d.telefono ?? '—'}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => verMaterias(d.ci)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                >
                  📘 Ver materias
                </button>
                <button
                  onClick={() => editarDocente(d)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => eliminarDocente(d.ci)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="flex items-center justify-center gap-4 mt-6">
      <button
        disabled={page === 1}
        onClick={() => setPage(p => p - 1)}
        className={`px-4 py-2 rounded ${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-600 text-white hover:bg-gray-700'}`}
      >
        ⬅️ Anterior
      </button>
      <span className="text-sm font-medium">
        Página {page} de {lastPage}
      </span>
      <button
        disabled={page === lastPage}
        onClick={() => setPage(p => p + 1)}
        className={`px-4 py-2 rounded ${page === lastPage ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-600 text-white hover:bg-gray-700'}`}
      >
        Siguiente ➡️
      </button>
    </div>
  </div>
);
}
