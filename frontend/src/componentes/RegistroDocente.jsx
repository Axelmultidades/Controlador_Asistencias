import { useState } from 'react';

export default function RegistroDocente({ onRegistroExitoso }) {
  const [ci, setCi] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const telefonoFinal = telefono === '' ? null : parseInt(telefono);

    try {
      const res = await fetch(`${API_URL}/api/profesor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ci: parseInt(ci),
          nombre,
          telefono: telefonoFinal,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert('✅ Docente registrado correctamente');
        setCi('');
        setNombre('');
        setTelefono('');
        if (onRegistroExitoso) onRegistroExitoso();
      } else {
        alert(data.message || '❌ No se pudo registrar el docente');
      }
    } catch (error) {
      console.error('Error al registrar docente:', error);
      alert('❌ Error al registrar el docente');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="mb-8">
    <h3 className="text-lg font-semibold mb-4">➕ Registrar nuevo docente</h3>
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row flex-wrap gap-4 items-start">
      <input
        type="number"
        placeholder="CI"
        value={ci}
        onChange={(e) => setCi(e.target.value)}
        required
        className="border rounded px-3 py-2 w-full md:w-auto"
      />
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        className="border rounded px-3 py-2 w-full md:w-auto"
      />
      <input
        type="number"
        placeholder="Teléfono (opcional)"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        className="border rounded px-3 py-2 w-full md:w-auto"
      />
      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 rounded text-white transition ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {loading ? 'Registrando...' : 'Registrar'}
      </button>
    </form>
  </div>
);

}
