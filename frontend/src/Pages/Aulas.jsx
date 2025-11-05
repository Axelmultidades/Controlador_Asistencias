import { useEffect, useState } from 'react';

export default function AulasPage() {
  const [aulas, setAulas] = useState([]);
  const [estadoBuscar, setEstadoBuscar] = useState('');
  const [numero, setNumero] = useState('');
  const [idPiso, setIdPiso] = useState('');
  const [estado, setEstado] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchAulas = async () => {
    try {
      const res = await fetch(`${API_URL}/api/aula`);
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
      const res = await fetch(`${API_URL}/api/aula/${estadoBuscar}`);
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
      const res = await fetch(`${API_URL}/api/aula`, {
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
      const res = await fetch(`${API_URL}/api/aula/${aula.id}`, {
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
      const res = await fetch(`${API_URL}/api/aula/${id}`, {
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
  <div className="p-4 md:p-8">
    <h2 className="text-2xl font-bold mb-6">🏫 Gestión de Aulas</h2>

    <form onSubmit={registrarAula} className="flex flex-col md:flex-row gap-4 mb-6">
      <input
        type="number"
        placeholder="Número"
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
        required
        className="border rounded px-3 py-2 w-full md:w-auto"
      />
      <input
        type="number"
        placeholder="ID Piso"
        value={idPiso}
        onChange={(e) => setIdPiso(e.target.value)}
        required
        className="border rounded px-3 py-2 w-full md:w-auto"
      />
      <input
        type="text"
        placeholder="Estado"
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
        required
        className="border rounded px-3 py-2 w-full md:w-auto"
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Registrar Aula
      </button>
    </form>

    <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
      <input
        type="text"
        placeholder="Buscar por estado (vacío, ocupado...)"
        value={estadoBuscar}
        onChange={(e) => setEstadoBuscar(e.target.value)}
        className="border rounded px-3 py-2 w-full md:w-80"
      />
      <button
        onClick={handleBuscar}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        🔍 Buscar
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Número</th>
            <th className="border px-4 py-2">ID Piso</th>
            <th className="border px-4 py-2">Estado</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {aulas.map((aula) => (
            <tr key={aula.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{aula.id}</td>
              <td className="border px-4 py-2">{aula.numero}</td>
              <td className="border px-4 py-2">{aula.id_piso}</td>
              <td className="border px-4 py-2">{aula.estado}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => editarAula(aula)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => eliminarAula(aula.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

}
