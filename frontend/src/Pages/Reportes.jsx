import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReporteAsistencia = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [profesores, setProfesores] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [filtros, setFiltros] = useState({
    ci_profesor: '',
    id_materia: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: '',
  });

  // Cargar profesores y materias al montar
  useEffect(() => {
    axios.get(`${API_URL}/api/profesor`)
      .then(res => {
        const lista = res.data?.data?.data || []; // paginado
        setProfesores(lista);
      })
      .catch(err => console.error('Error al cargar profesores:', err));

    axios.get(`${API_URL}/api/materia_grupo/materias`)
      .then(res => {
        const lista = Array.isArray(res.data?.data) ? res.data.data : [];
        setMaterias(lista);
      })
      .catch(err => console.error('Error al cargar materias:', err));
  }, []);

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const exportarExcel = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/exportar-reporte`, {
        params: filtros,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reporte_asistencias.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error al exportar:', error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2>📄 Exportar Reporte de Asistencias</h2>

      <div>
        <label>👨‍🏫 Profesor:</label>
        <select name="ci_profesor" value={filtros.ci_profesor} onChange={handleChange}>
          <option value="">Todos</option>
          {profesores.map(p => (
            <option key={p.ci} value={p.ci}>{p.nombre}</option>
          ))}
        </select>
      </div>

      <div>
        <label>📚 Materia:</label>
        <select name="id_materia" value={filtros.id_materia} onChange={handleChange}>
          <option value="">Todas</option>
          {materias.map(m => (
            <option key={m.id} value={m.id}>{m.nombre}</option>
          ))}
        </select>
      </div>

      <div>
        <label>📅 Fecha inicio:</label>
        <input type="date" name="fecha_inicio" value={filtros.fecha_inicio} onChange={handleChange} />
      </div>

      <div>
        <label>📅 Fecha fin:</label>
        <input type="date" name="fecha_fin" value={filtros.fecha_fin} onChange={handleChange} />
      </div>

      <div>
        <label>📌 Estado:</label>
        <select name="estado" value={filtros.estado} onChange={handleChange}>
          <option value="">Todos</option>
          <option value="presente">Presente</option>
          <option value="ausente">Ausente</option>
          <option value="justificado">Justificado</option>
        </select>
      </div>

      <button onClick={exportarExcel} style={{ marginTop: '20px' }}>
        📥 Descargar Excel
      </button>
    </div>
  );
};

export default ReporteAsistencia;
