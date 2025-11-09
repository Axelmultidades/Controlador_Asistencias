import { useEffect, useState } from 'react';

export default function List_horarios() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHorarios = async () => {
    try {
      const res = await fetch(`${API_URL}/api/horario`);
      const data = await res.json();
      setHorarios(data.data || []);
    } catch (err) {
      alert('Error al cargar horarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHorarios();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Cargando horarios...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold mb-4 text-center">Lista de Horarios</h2>
      <table className="min-w-full border border-gray-300 rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Día</th>
            <th className="px-4 py-2 text-left">Hora Inicial</th>
            <th className="px-4 py-2 text-left">Hora Final</th>
          </tr>
        </thead>
        <tbody>
          {horarios.map((h, i) => (
            <tr key={i} className="border-t">
              <td className="px-4 py-2 capitalize">{h.dia}</td>
              <td className="px-4 py-2">{h.hora_inicial.slice(0, 5)}</td>
              <td className="px-4 py-2">{h.hora_final.slice(0, 5)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
