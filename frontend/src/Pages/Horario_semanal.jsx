import { useEffect, useState } from 'react';
import HorarioSemanalProfesor from '../componentes/profesor/HorarioSemanalProfesor.jsx';

export default function HorarioSemanal({ usuario }) {
  const [mostrarHorario, setMostrarHorario] = useState(false);
  const ci_profesor = usuario?.ci_profesor;

  useEffect(() => {
    if (ci_profesor) {
      setMostrarHorario(true);
    }
  }, [ci_profesor]);

  console.log('CI del profesor:', ci_profesor);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Consultar Horario Semanal</h1>
      {mostrarHorario && <HorarioSemanalProfesor ci={ci_profesor} />}
    </div>
  );
}
