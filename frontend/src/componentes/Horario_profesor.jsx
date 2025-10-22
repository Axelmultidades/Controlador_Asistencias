import { useState, useEffect } from 'react';
import axios from 'axios';

function HorarioProfesor({ ci }) {
  const [horario, setHorario] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/horario/${ci}`)
      .then(res => setHorario(res.data))
      .catch(err => console.error('Error al obtener horario:', err));
  }, [ci]);

  return (
    <div>
      <h2>Horario del Profesor CI: {ci}</h2>
      <table border="1">
        <thead>   
          <tr>
            <th>Día</th>
            <th>Hora Inicial</th>
            <th>Hora Final</th>
            <th>Materia</th>
          </tr>
        </thead>
        <tbody>
          {horario.map((h, index) => (
            <tr key={index}>
              <td>{h.dia}</td>
              <td>{h.hora_inicial}</td>
              <td>{h.hora_final}</td>
              <td>{h.materia}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HorarioProfesor;
