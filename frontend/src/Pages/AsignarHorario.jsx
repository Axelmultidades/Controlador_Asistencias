import { useEffect, useState } from 'react';
import React from 'react';
import List_horarios from '../componentes/AsignarHorario/Listar_horarios.jsx';
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
    if ( !idPMG || !numeroAula) {
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
  <div className="p-4 md:p-8">
    <h2 className="text-2xl font-bold mb-6">📘 Crear Nueva Clase</h2>

    <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-6">
      <input
        type="number"
        placeholder="Número de aula"
        value={numeroAula}
        onChange={(e) => setNumeroAula(e.target.value)}
        className="border rounded px-3 py-2 w-full md:w-auto"
      />
      <select
        value={idPMG}
        onChange={(e) => setIdPMG(e.target.value)}
        className="border rounded px-3 py-2 w-full md:w-auto"
      >
        <option value="">Seleccionar profesor-materia-grupo</option>
        {relacionesPMG.map((rel) => (
          <option key={rel.id} value={rel.id}>
            {rel.profesor} – {rel.materia} – {rel.grupo}
          </option>
        ))}
      </select>
    </div>

    <button
      onClick={crearClase}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
    >
      🆕 Crear Clase
    </button>

    <hr className="my-8 border-t border-gray-300" />

    <h2 className="text-2xl font-bold mb-6">🕒 Asignar Horario a Clase</h2>

    <div className="mb-4">
      <select
        value={claseSeleccionada}
        onChange={(e) => setClaseSeleccionada(e.target.value)}
        className="border rounded px-3 py-2 w-full md:w-1/2"
      >
        <option value="" disabled>Seleccionar clase</option>
        {clases.map((clase) => (
          <option key={clase.id} value={clase.id}>
            Aula {clase.numero_aula} – ci_docente {clase.ci_profesor}
          </option>
        ))}
      </select>
    </div>

    <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-6">
      <input
        type="text"
        placeholder="Día (ej. Lunes)"
        value={dia}
        onChange={(e) => setDia(e.target.value)}
        className="border rounded px-3 py-2 w-full md:w-auto"
      />
      <input
        type="time"
        value={horaInicio}
        onChange={(e) => setHoraInicio(e.target.value)}
        className="border rounded px-3 py-2 w-full md:w-auto"
      />
      <input
        type="time"
        value={horaFin}
        onChange={(e) => setHoraFin(e.target.value)}
        className="border rounded px-3 py-2 w-full md:w-auto"
      />
    </div>

    <button
      onClick={asignarHorario}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      📎 Asignar Horario
    </button>
    <hr className="my-8 border-t border-gray-300" />
    <List_horarios />
  </div>
);

}
