import { useEffect, useState } from 'react';

export default function AulasPage() {
  const [aulas, setAulas] = useState([]);
  const [estadoBuscar, setEstadoBuscar] = useState('');
  const [numero, setNumero] = useState('');
  const [idPiso, setIdPiso] = useState('');
  const [estado, setEstado] = useState('');

  const fetchAulas = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/aula`);
      const data = await res.json();
      setAulas(data.data || []);
    } catch (error) {
      console.error('Error al cargar aulas:', error);
      alert('Hubo un problema al cargar las aulas.');
    }
  };

  useEffect(() => {
    fetchAulas();
  }, []);

  const handleBuscar = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/aula/${estadoBuscar}`);
      const data = await res.json();
      if (data.success) {
        setAulas(data.data);
      } else {
        alert(data.message || 'No se encontraron aulas con ese estado');
      }
    } catch (error) {
      console.error('Error al buscar aulas:', error);
      alert('No se pudo buscar aulas por estado');
    }
  };

  const registrarAula = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8000/api/aula`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numero: parseInt(numero),
          id_piso: parseInt(idPiso),
          estado,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Aula registrada correctamente');
        setNumero('');
        setIdPiso('');
        setEstado('');
        fetchAulas();
      } else {
        alert(data.message || 'No se pudo registrar el aula');
      }
    } catch (error) {
      console.error('Error al registrar aula:', error);
      alert('Error al registrar el aula');
    }
  };

  const editarAula = async (aula) => {
    const nuevoNumero = prompt('Nuevo número:', aula.numero);
    const nuevoPiso = prompt('Nuevo ID de piso:', aula.id_piso);
    const nuevoEstado = prompt('Nuevo estado:', aula.estado);

    if (!nuevoNumero || !nuevoPiso || !nuevoEstado) return;

    try {
      const res = await fetch(`http://localhost:8000/api/aula/${aula.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numero: parseInt(nuevoNumero),
          id_piso: parseInt(nuevoPiso),
          estado: nuevoEstado,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Aula actualizada correctamente');
        fetchAulas();
      } else {
        alert(data.message || 'No se pudo actualizar el aula');
      }
    } catch (error) {
      console.error('Error al editar aula:', error);
      alert('Error al actualizar el aula');
    }
  };

  const eliminarAula = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar esta aula?')) return;

    try {
      const res = await fetch(`http://localhost:8000/api/aula/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        alert('Aula eliminada correctamente');
        fetchAulas();
      } else {
        alert(data.message || 'No se pudo eliminar el aula');
      }
    } catch (error) {
      console.error('Error al eliminar aula:', error);
      alert('Error al eliminar el aula');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🏫 Gestión de Aulas</h2>

      <form onSubmit={registrarAula} style={{ marginBottom: '2rem' }}>
        <input
          type="number"
          placeholder="Número"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          required
          style={{ marginRight: '1rem' }}
        />
        <input
          type="number"
          placeholder="ID Piso"
          value={idPiso}
          onChange={(e) => setIdPiso(e.target.value)}
          required
          style={{ marginRight: '1rem' }}
        />
        <input
          type="text"
          placeholder="Estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          required
          style={{ marginRight: '1rem' }}
        />
        <button type="submit">Registrar Aula</button>
      </form>

      <input
        type="text"
        placeholder="Buscar por estado (vacio, ocupado...)"
        value={estadoBuscar}
        onChange={(e) => setEstadoBuscar(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '300px' }}
      />
      <button onClick={handleBuscar} style={{ marginLeft: '1rem' }}>🔍 Buscar</button>

      <table border="1" cellPadding="8" style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Número</th>
            <th>ID Piso</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {aulas.map((aula) => (
            <tr key={aula.id}>
              <td>{aula.id}</td>
              <td>{aula.numero}</td>
              <td>{aula.id_piso}</td>
              <td>{aula.estado}</td>
              <td>
                <button onClick={() => editarAula(aula)}>✏️ Editar</button>{' '}
                <button onClick={() => eliminarAula(aula.id)}>🗑️ Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
