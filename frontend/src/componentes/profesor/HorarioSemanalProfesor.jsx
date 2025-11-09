import { useEffect, useState } from 'react';
import axios from 'axios';

const diasOrdenados = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

export default function HorarioSemanalProfesor({ ci }) {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;  
  useEffect(() => {
    axios.get(`${API_URL}/api/horario/profesor/${ci}`)
      .then(res => {
      const normalizados = res.data.map(h => ({
        ...h,
        dia: h.dia.toLowerCase()
      }));

      const ordenados = diasOrdenados.map(dia =>
        normalizados.filter(h => h.dia === dia).sort((a, b) => a.hora_inicial.localeCompare(b.hora_inicial))
      ).flat();

      setHorarios(ordenados);
    })
    .catch(err => console.error('Error al cargar horarios:', err))
    .finally(() => setLoading(false));
}, [ci]);

  if (loading) return <p className="text-center text-gray-500">Cargando horarios...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Día</th>
            <th className="px-4 py-2 text-left">Hora</th>
            <th className="px-4 py-2 text-left">Materia</th>
            <th className="px-4 py-2 text-left">Grupo</th>
            <th className="px-4 py-2 text-left">Aula</th>
          </tr>
        </thead>
        <tbody>
          {horarios.map((h, i) => (
            <tr key={i} className="border-t">
              <td className="px-4 py-2 capitalize">{h.dia}</td>
              <td className="px-4 py-2">{h.hora_inicial} - {h.hora_final}</td>
              <td className="px-4 py-2">{h.materia}</td>
              <td className="px-4 py-2">{h.grupo}</td>
              <td className="px-4 py-2">{h.aula}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
