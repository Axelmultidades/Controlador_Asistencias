import { useEffect, useState } from 'react';
import axios from 'axios';


function List_profesor() {
    const [profesores, setProfesores] = useState([]);
    useEffect(() => {
  axios.get('http://localhost:8000/api/profesores')
    .then(response => {
      console.log(response.data); // ¿Cada objeto tiene CI?
      setProfesores(response.data);
    })
    .catch(error => console.error('Error al obtener profesores:', error));
}, []);
     return (
    <div>
      <h1>Lista de Profesores</h1>
      <ul>
        {profesores.map(p => (
          <li key={p.ci}>{p.nombre} - {p.telefono}</li>
        ))}

      </ul>
    </div>
  );
}

export default List_profesor;