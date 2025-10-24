import '../estilos/List_profesor.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function List_profesor() {
  const [profesores, setProfesores] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/profesores')
      .then(response => {
        setProfesores(response.data);
      })
      .catch(error => console.error('Error al obtener profesores:', error));
  }, []);

  return (
    <div className="container">
      <h1>Lista de Profesores</h1>
      <ul className="profesor-list">
        {profesores.map(p => (
          <li key={p.ci}>
            <span className="ci">CI: {p.ci}  </span>
            <span className="nombre">{p.nombre}  </span>
            <span className="telefono">Teléfono: {p.telefono}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default List_profesor;
