import { useState, useEffect } from 'react';

function AsignarRol() {
  const [form, setForm] = useState({
    user_id: '',
    rol: '',
    ci: '',
  });
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;

  // Obtener usuarios y roles al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUsuarios = await fetch(`${API_URL}/api/administrar_usuario/listar_usuarios`);
        const resRoles = await fetch(`${API_URL}/api/administrar_usuario/listar_roles`);

        const dataUsuarios = await resUsuarios.json();
        const dataRoles = await resRoles.json();

        setUsuarios(dataUsuarios);
        setRoles(dataRoles);
      } catch (err) {
        setError('❌ Error al cargar usuarios o roles');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    // Validar CI si el rol es profesor
    if (form.rol === 'profesor' && !form.ci.trim()) {
      setError('❌ Debes ingresar el CI del profesor');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/administrar_usuario/asignar_rol`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al asignar el rol');
      }

      setMensaje(`✅ Rol asignado correctamente a ${data.user.nombre}`);
      setForm({ user_id: '', rol: '', ci: '' });
    } catch (err) {
      setError(`❌ ${err.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Asignar Rol a Usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="user_id"
          value={form.user_id}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Selecciona un usuario</option>
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>
              {u.codigo} - {u.username}
            </option>
          ))}
        </select>

        <select
          name="rol"
          value={form.rol}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Selecciona un rol</option>
          {roles.map((r) => (
            <option key={r.id} value={r.nombre}>
              {r.nombre}
            </option>
          ))}
        </select>

        {form.rol === 'profesor' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">CI del profesor</label>
            <input
              type="number"
              name="ci"
              value={form.ci}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
            <p className="text-sm text-gray-500 mt-1">Este campo es obligatorio para el rol profesor</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Asignar Rol
        </button>
      </form>
      {mensaje && <p className="mt-4 text-green-600">{mensaje}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}

export default AsignarRol;
