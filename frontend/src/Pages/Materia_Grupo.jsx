import { useEffect, useState } from 'react';
import AsignarMateria from '../componentes/AsignarMateria';
export default function MateriaGrupoPage() {
  const [materias, setMaterias] = useState([]);
  const [materiasDisponibles, setMateriasDisponibles] = useState([]);
  const [nombreMateria, setNombreMateria] = useState('');
  const [nombreGrupo, setNombreGrupo] = useState('');
  const [materiaSeleccionada, setMateriaSeleccionada] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchMaterias = async () => {
    try {
      const res = await fetch(`${API_URL}/api/materia_grupo/materia`);
      const data = await res.json();
      setMateriasDisponibles(data.data || []);
    } catch {
      alert('Error al cargar materias disponibles');
    }
  };

  const fetchMateriasConGrupos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/materia_grupo/vinculados`);
      const data = await res.json();
      setMaterias(data.data || []);
    } catch {
      alert('Error al cargar materias con grupos');
    }
  };

  useEffect(() => {
    fetchMaterias();
    fetchMateriasConGrupos();
  }, []);

  const crearMateria = async () => {
    try {
      const res = await fetch(`${API_URL}/api/materia_grupo/materia`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombreMateria }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Materia creada');
        setNombreMateria('');
        fetchMaterias();
        fetchMateriasConGrupos();
      } else {
        alert(data.message);
      }
    } catch {
      alert('Error al crear materia');
    }
  };

  const editarMateria = async (materia) => {
    const nuevoNombre = prompt('Nuevo nombre de materia:', materia.nombre);
    if (!nuevoNombre) return;

    try {
      const res = await fetch(`${API_URL}/api/materia_grupo/materia/${materia.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nuevoNombre }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Materia actualizada');
        fetchMaterias();
        fetchMateriasConGrupos();
      } else {
        alert(data.message);
      }
    } catch {
      alert('Error al editar materia');
    }
  };

  const eliminarMateria = async (id) => {
    if (!confirm('¿Eliminar esta materia?')) return;
    try {
      const res = await fetch(`${API_URL}/api/materia_grupo/materia/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        alert('Materia eliminada');
        fetchMaterias();
        fetchMateriasConGrupos();
      } else {
        alert(data.message);
      }
    } catch {
      alert('Error al eliminar materia');
    }
  };

  const asignarGrupo = async () => {
    if (!materiaSeleccionada || !nombreGrupo) return;

    try {
      const res = await fetch(`${API_URL}/api/materia_grupo/materia/${materiaSeleccionada}/grupo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombreGrupo }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Grupo asignado');
        setNombreGrupo('');
        fetchMateriasConGrupos();
      } else {
        alert(data.message);
      }
    } catch {
      alert('Error al asignar grupo');
    }
  };

  const editarGrupo = async (grupoId) => {
    const nuevoNombre = prompt('Nuevo nombre del grupo:');
    if (!nuevoNombre) return;

    try {
      const res = await fetch(`${API_URL}/api/materia_grupo/grupo/${grupoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nuevoNombre }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Grupo actualizado');
        fetchMateriasConGrupos();
      } else {
        alert(data.message);
      }
    } catch {
      alert('Error al editar grupo');
    }
  };

  const eliminarGrupo = async (grupoId) => {
    if (!confirm('¿Eliminar este grupo?')) return;

    try {
      const res = await fetch(`${API_URL}/api/materia_grupo/grupo/${grupoId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        alert('Grupo eliminado');
        fetchMateriasConGrupos();
      } else {
        alert(data.message);
      }
    } catch {
      alert('Error al eliminar grupo');
    }
  };

  const desasignarGrupo = async (materiaId, grupoId) => {
    if (!confirm('¿Desasignar este grupo de la materia?')) return;

    try {
      const res = await fetch(`${API_URL}/api/materia_grupo/materia/${materiaId}/grupo/${grupoId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        alert('Grupo desasignado');
        fetchMateriasConGrupos();
      } else {
        alert(data.message);
      }
    } catch {
      alert('Error al desasignar grupo');
    }
  };

 return (
  <div className="p-4 md:p-8">
    <h2 className="text-2xl font-bold mb-6">📚 Materias y Grupos Asignados</h2>

    <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
      <input
        type="text"
        placeholder="Nombre de materia"
        value={nombreMateria}
        onChange={(e) => setNombreMateria(e.target.value)}
        className="border rounded px-3 py-2 w-full md:w-auto"
      />
      <button
        onClick={crearMateria}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        ➕ Crear Materia
      </button>
    </div>

    <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
      <select
        onChange={(e) => setMateriaSeleccionada(e.target.value)}
        value={materiaSeleccionada}
        className="border rounded px-3 py-2 w-full md:w-auto"
      >
        <option value="" disabled>Seleccionar profesor y materia</option>
        {materiasDisponibles.map((m, index) => (
          <option key={m.id ?? `asig-${index}`} value={m.id}>
            {m.profesor_nombre} – {m.materia_nombre}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Nombre del grupo"
        value={nombreGrupo}
        onChange={(e) => setNombreGrupo(e.target.value)}
        className="border rounded px-3 py-2 w-full md:w-auto"
      />
      <button
        onClick={asignarGrupo}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        📎 Asignar Grupo
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID Materia</th>
            <th className="border px-4 py-2">Materia</th>
            <th className="border px-4 py-2">Grupos</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {materias.map((m, index) => (
            <tr key={m.id ?? `row-${index}`} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{m.id}</td>
              <td className="border px-4 py-2">{m.nombre}</td>
              <td className="border px-4 py-2 space-y-2">
                {m.grupos.length === 0 ? (
                  <i>Sin grupos</i>
                ) : (
                  m.grupos.map((g, gi) => (
                    <div key={g.id ?? `grupo-${gi}`} className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{g.id}</span> – {g.nombre}
                      <button
                        onClick={() => editarGrupo(g.id)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => eliminarGrupo(g.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                      >
                        🗑️
                      </button>
                      <button
                        onClick={() => desasignarGrupo(m.id, g.id)}
                        className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition"
                      >
                        ❌
                      </button>
                    </div>
                  ))
                )}
              </td>
              <td className="border px-4 py-2 space-y-2">
                <button
                  onClick={() => editarMateria(m)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => eliminarMateria(m.id)}
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
    <hr className="my-8" />
    <AsignarMateria />
  </div>
);

}
