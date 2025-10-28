import { useEffect, useState } from 'react';

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
    <div style={{ padding: '2rem' }}>
      <h2>📚 Materias y Grupos Asignados</h2>

      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Nombre de materia"
          value={nombreMateria}
          onChange={(e) => setNombreMateria(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
        <button onClick={crearMateria}>➕ Crear Materia</button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <select onChange={(e) => setMateriaSeleccionada(e.target.value)} value={materiaSeleccionada}>
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
          style={{ marginLeft: '1rem', marginRight: '1rem' }}
        />
        <button onClick={asignarGrupo}>📎 Asignar Grupo</button>
      </div>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID Materia</th>
            <th>Materia</th>
            <th>Grupos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {materias.map((m, index) => (
            <tr key={m.id ?? `row-${index}`}>
              <td>{m.id}</td>
              <td>{m.nombre}</td>
              <td>
                {m.grupos.length === 0 ? (
                  <i>Sin grupos</i>
                ) : (
                  m.grupos.map((g, gi) => (
                    <div key={g.id ?? `grupo-${gi}`}>
                      <strong>{g.id}</strong> – {g.nombre}{' '}
                      <button onClick={() => editarGrupo(g.id)}>✏️</button>{' '}
                      <button onClick={() => eliminarGrupo(g.id)}>🗑️</button>{' '}
                      <button onClick={() => desasignarGrupo(m.id, g.id)}>❌</button>
                    </div>
                  ))
                )}
              </td>
              <td>
                <button onClick={() => editarMateria(m)}>✏️ Editar</button>{' '}
                <button onClick={() => eliminarMateria(m.id)}>🗑️ Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
