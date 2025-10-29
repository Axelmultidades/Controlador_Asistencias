import { useEffect, useState } from 'react';

export default function AsignarMateria() {
  const [profesores, setProfesores] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [profesorSeleccionado, setProfesorSeleccionado] = useState('');
  const [materiaSeleccionada, setMateriaSeleccionada] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  // =====================
  // Fetchers
  // =====================
  const fetchProfesores = async () => {
    try {
      const res = await fetch(`${API_URL}/api/profesor`);
      const data = await res.json();
      const lista = Array.isArray(data.data?.data) ? data.data.data : [];
      setProfesores(lista);
    } catch {
      alert('Error al cargar profesores');
    }
  };

  const fetchMaterias = async () => {
    try {
      const res = await fetch(`${API_URL}/api/materia_grupo/materias`);
      const data = await res.json();
      setMaterias(data.data || []);
    } catch {
      alert('Error al cargar materias');
    }
  };

  useEffect(() => {
    fetchProfesores();
    fetchMaterias();
  }, []);

  // =====================
  // Asignar materia
  // =====================
  const asignarMateria = async () => {
    if (!profesorSeleccionado || !materiaSeleccionada) {
      alert('Seleccione un profesor y una materia');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/materia_grupo/asignar_materia_profesor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_profesor: profesorSeleccionado,
          id_materia: materiaSeleccionada,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert('Materia asignada correctamente');
        setProfesorSeleccionado('');
        setMateriaSeleccionada('');
      } else {
        alert(data.message);
      }
    } catch {
      alert('Error al asignar materia');
    }
  };

  // =====================
  // Render
  // =====================
  return (
    <div style={{ padding: '2rem' }}>
      <h3>📎 Asignar Materia a Profesor</h3>

      <div style={{ marginBottom: '1rem' }}>
        <select
          value={profesorSeleccionado}
          onChange={(e) => setProfesorSeleccionado(e.target.value)}
          style={{ marginRight: '1rem' }}
        >
          <option value="">👨‍🏫 Seleccionar Profesor</option>
          {profesores.map((p) => (
            <option key={p.ci} value={p.ci}>
              {p.nombre}
            </option>
          ))}
        </select>

        <select
          value={materiaSeleccionada}
          onChange={(e) => setMateriaSeleccionada(e.target.value)}
          style={{ marginRight: '1rem' }}
        >
          <option value="">📘 Seleccionar Materia</option>
          {materias.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </select>

        <button onClick={asignarMateria}>✅ Asignar</button>
      </div>
    </div>
  );
}
