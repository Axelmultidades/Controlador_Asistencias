// src/components/CrearRol.jsx
import { useState } from 'react';

function CrearRol() {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;   
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/administrar_usuario/crear_rol`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al crear el rol');
      }

      setMensaje(`✅ Rol creado correctamente: ${data.role_id}`);
      setNombre('');
    } catch (err) {
      setError(`❌ ${err.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Crear nuevo rol</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del rol"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Crear Rol
        </button>
      </form>
      {mensaje && <p className="mt-4 text-green-600">{mensaje}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}

export default CrearRol;
