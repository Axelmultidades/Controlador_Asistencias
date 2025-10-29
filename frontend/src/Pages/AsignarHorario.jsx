import { useEffect, useState } from 'react';

export default function AsignarHorarioPage() {
  const [clases, setClases] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [relacionesPMG, setRelacionesPMG] = useState([]);

  const [claseSeleccionada, setClaseSeleccionada] = useState('');
  const [dia, setDia] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');

  const [fecha, setFecha] = useState('');
  const [idHorario, setIdHorario] = useState('');
  const [numeroAula, setNumeroAula] = useState('');
  const [idPMG, setIdPMG] = useState('');

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

  const fetchHorarios = async () => {
    try {
      const res = await fetch(`${API_URL}/api/horario`);
      const data = await res.json();
      setHorarios(data.data || []);
    } catch (err) {
      alert('Error al cargar horarios');
    }
  };

  const fetchRelacionesPMG = async () => {
    try {
      const res = await fetch(`${API_URL}/api/clases/profesor-materia-grupo`);
      const data = await res.json();
      setRelacionesPMG(data.data || []);
    } catch (err) {
      alert('Error al cargar relaciones profesor-materia-grupo');
    }
  };

  useEffect(() => {
    fetchClases();
    fetchHorarios();
    fetchRelacionesPMG();
  }, []);

  const crearClase = async () => {
    if (!fecha || !idPMG || !numeroAula) {
      alert('Completa los campos obligatorios');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/clases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha,
          id_profesor_materia_grupo: idPMG,
          id_horario: idHorario || null,
          numero_aula: numeroAula,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`Clase creada con ID ${data.clase_id}`);
        setFecha('');
        setIdHorario('');
        setNumeroAula('');
        setIdPMG('');
        fetchClases();
      } else {
        alert(data.message || 'No se pudo crear la clase');
      }
    } catch (err) {
      alert('Error al crear la clase');
    }
  };

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
      <h2>📘 Crear Nueva Clase</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
        <select
          value={idHorario}
          onChange={(e) => setIdHorario(e.target.value)}
          style={{ marginRight: '1rem' }}
        >
          <option value="">Sin horario (opcional)</option>
          {horarios.map((h) => (
            <option key={h.id} value={h.id}>
              {h.dia} {h.hora_inicial} - {h.hora_final}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Número de aula"
          value={numeroAula}
          onChange={(e) => setNumeroAula(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
        <select
          value={idPMG}
          onChange={(e) => setIdPMG(e.target.value)}
        >
          <option value="">Seleccionar profesor-materia-grupo</option>
          {relacionesPMG.map((rel) => (
            <option key={rel.id} value={rel.id}>
              {rel.profesor} – {rel.materia} – {rel.grupo}
            </option>
          ))}
        </select>
      </div>
      <button onClick={crearClase}>🆕 Crear Clase</button>

      <hr style={{ margin: '2rem 0' }} />

      <h2>🕒 Asignar Horario a Clase</h2>
      <div style={{ marginBottom: '1rem' }}>
        <select value={claseSeleccionada} onChange={(e) => setClaseSeleccionada(e.target.value)}>
          <option value="" disabled>Seleccionar clase</option>
          {clases.map((clase) => (
            <option key={clase.id} value={clase.id}>
              Aula {clase.numero_aula} – ci_docente {clase.ci_profesor}
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
