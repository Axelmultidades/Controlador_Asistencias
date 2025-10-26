import { useEffect, useState } from 'react';

export default function AsignarHorarioPage() {
  const [clases, setClases] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState('');
  const [dia, setDia] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchClases = async () => {
    try {
      const res = await fetch(`${API_URL}/api/clases`);
      const data = await res.json();
      setClases(data.data || []);
    } catch (err) {
      alert('Error al cargar clases');
    }
  };

  useEffect(() => {
    fetchClases();
  }, []);

  const asignarHorario = async () => {
    if (!claseSeleccionada || !dia || !horaInicio || !horaFin) {
      alert('Completa todos los campos');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/horario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clase_id: claseSeleccionada,
          dia,
          hora_inicio: horaInicio,
          hora_fin: horaFin,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Horario asignado correctamente');
        setDia('');
        setHoraInicio('');
        setHoraFin('');
        setClaseSeleccionada('');
      } else {
        alert(data.message || 'No se pudo asignar el horario');
      }
    } catch (err) {
      alert('Error al asignar horario');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🕒 Asignar Horario a Clase</h2>

      <div style={{ marginBottom: '1rem' }}>
        <select value={claseSeleccionada} onChange={(e) => setClaseSeleccionada(e.target.value)}>
          <option value="" disabled>Seleccionar clase</option>
          {clases.map((clase) => (
            <option key={clase.id} value={clase.id}>
              id_aula {clase.id_aula} – ci_docente {clase.ci_profesor}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Día (ej. Lunes)"
          value={dia}
          onChange={(e) => setDia(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
        <input
          type="time"
          value={horaInicio}
          onChange={(e) => setHoraInicio(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
        <input
          type="time"
          value={horaFin}
          onChange={(e) => setHoraFin(e.target.value)}
        />
      </div>

      <button onClick={asignarHorario}>📎 Asignar Horario</button>
    </div>
  );
}
