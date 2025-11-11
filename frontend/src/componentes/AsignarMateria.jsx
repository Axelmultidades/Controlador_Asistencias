import { useEffect, useState } from 'react';

export default function AsignarMateria() {
  const [profesores, setProfesores] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [profesorSeleccionado, setProfesorSeleccionado] = useState('');
  const [materiaSeleccionada, setMateriaSeleccionada] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

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
          ci_profesor: profesorSeleccionado,
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

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
        📎 Asignar Materia a Profesor
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">👨‍🏫 Profesor</label>
          <select
            value={profesorSeleccionado}
            onChange={(e) => setProfesorSeleccionado(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Seleccionar Profesor</option>
            {profesores.map((p) => (
              <option key={p.ci} value={p.ci}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">📘 Materia</label>
          <select
            value={materiaSeleccionada}
            onChange={(e) => setMateriaSeleccionada(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Seleccionar Materia</option>
            {materias.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={asignarMateria}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          ✅ Asignar
        </button>
      </div>
    </div>
  );
}
