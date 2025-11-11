import { useState } from 'react';
import HorarioSemanalProfesor from '../componentes/profesor/HorarioSemanalProfesor.jsx';

export default function HorarioSemanal({ usuario }) {
  const [ci, setCi] = useState('');
  const [mostrarHorario, setMostrarHorario] = useState(false);
  const ci_profesor = usuario.ci_profesor;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (ci.trim()) {
      setMostrarHorario(true);
    }
  };
  console.log('CI del profesor:', usuario.ci_profesor);
  return (
    
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Consultar Horario Semanal</h1>
      {mostrarHorario && <HorarioSemanalProfesor ci={ci_profesor} />}
    </div>
  );
}
