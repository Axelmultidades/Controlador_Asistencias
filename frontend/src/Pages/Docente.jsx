import { useEffect, useState } from 'react';
import RegistroDocente from '../componentes/RegistroDocente.jsx';

export default function DocentesPage() {
  const [docentes, setDocentes] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchDocentes = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/profesor?buscar=${buscar}&page=${page}`);
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
      const res = await fetch(`http://localhost:8000/api/profesor/${ci}/materias`);
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        alert(`Materias de ${ci}:\n` + data.data.map(m => `• ${m.nombre}`).join('\n'));
      } else {
        alert(`El docente ${ci} no tiene materias asignadas.`);
      }
    } catch (error) {
      console.error('Error al cargar materias:', error);
      alert('No se pudieron cargar las materias del docente.');
    }
  };

  const eliminarDocente = async (ci) => {
    if (!confirm(`¿Seguro que deseas eliminar al docente con CI ${ci}?`)) return;

    try {
      const res = await fetch(`http://localhost:8000/api/profesor/${ci}`, {
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
    const nuevoTelefono = prompt('Nuevo teléfono:', docente.telefono);

    if (!nuevoNombre || !nuevoTelefono) return;

    try {
      const res = await fetch(`http://localhost:8000/api/profesor/${docente.ci}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ci: docente.ci,
          nombre: nuevoNombre,
          telefono: parseInt(nuevoTelefono),
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
    <div style={{ padding: '2rem' }}>
      <h2>📚 Gestión de Docentes</h2>

      <RegistroDocente onRegistroExitoso={fetchDocentes} />

      <input
        type="text"
        placeholder="Buscar por nombre o CI..."
        value={buscar}
        onChange={handleBuscar}
        style={{ padding: '0.5rem', marginBottom: '1rem', width: '300px' }}
      />

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>CI</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {docentes.map((d) => (
            <tr key={d.ci}>
              <td>{d.ci}</td>
              <td>{d.nombre}</td>
              <td>{d.telefono}</td>
              <td>
                <button onClick={() => verMaterias(d.ci)}>📘 Ver materias</button>{' '}
                <button onClick={() => editarDocente(d)}>✏️ Editar</button>{' '}
                <button onClick={() => eliminarDocente(d.ci)}>🗑️ Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem' }}>
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>⬅️ Anterior</button>
        <span style={{ margin: '0 1rem' }}>Página {page} de {lastPage}</span>
        <button disabled={page === lastPage} onClick={() => setPage(p => p + 1)}>Siguiente ➡️</button>
      </div>
    </div>
  );
}
