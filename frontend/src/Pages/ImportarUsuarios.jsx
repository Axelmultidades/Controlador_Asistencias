import React, { useState } from 'react';
import axios from 'axios';

function ImportarUsuarios() {
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
    
  const API_URL = import.meta.env.VITE_API_URL;
  const handleArchivo = (e) => {
    setArchivo(e.target.files[0]);
    setMensaje('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!archivo) {
      setMensaje('Selecciona un archivo primero');
      return;
    }

    const formData = new FormData();
    formData.append('archivo', archivo);

    try {
      setCargando(true);
      const res = await axios.post(`${API_URL}/api/importar-usuarios`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMensaje(res.data.message || 'Importación completada');
    } catch (err) {
      setMensaje(err.response?.data?.message || 'Error al importar');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Importar Usuarios desde Excel</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleArchivo}
          className="mb-4 block w-full"
        />
        <button
          type="submit"
          disabled={cargando}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {cargando ? 'Importando...' : 'Subir archivo'}
        </button>
      </form>
      {mensaje && <p className="mt-4 text-sm text-gray-700">{mensaje}</p>}
    </div>
  );
}

export default ImportarUsuarios;
