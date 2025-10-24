import { useState } from 'react';

export default function RegistroDocente({ onRegistroExitoso }) {
  const [ci, setCi] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/profesor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ci: parseInt(ci),
          nombre,
          telefono: parseInt(telefono),
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert('✅ Docente registrado correctamente');
        setCi('');
        setNombre('');
        setTelefono('');
        if (onRegistroExitoso) onRegistroExitoso(); // recarga lista si se pasa callback
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
    <div style={{ marginBottom: '2rem' }}>
      <h3>➕ Registrar nuevo docente</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="CI"
          value={ci}
          onChange={(e) => setCi(e.target.value)}
          required
          style={{ marginRight: '1rem' }}
        />
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          style={{ marginRight: '1rem' }}
        />
        <input
          type="number"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
          style={{ marginRight: '1rem' }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
    </div>
  );
}
