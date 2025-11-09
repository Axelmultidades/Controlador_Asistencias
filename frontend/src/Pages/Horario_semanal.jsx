import { useState } from 'react';
import HorarioSemanalProfesor from '../componentes/profesor/HorarioSemanalProfesor.jsx';

export default function HorarioSemanal() {
  const [ci, setCi] = useState('');
  const [mostrarHorario, setMostrarHorario] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ci.trim()) {
      setMostrarHorario(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Consultar Horario Semanal</h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <input
          type="text"
          value={ci}
          onChange={(e) => setCi(e.target.value)}
          placeholder="Ingrese CI del profesor"
          className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Consultar
        </button>
      </form>

      {mostrarHorario && <HorarioSemanalProfesor ci={ci} />}
    </div>
  );
}
