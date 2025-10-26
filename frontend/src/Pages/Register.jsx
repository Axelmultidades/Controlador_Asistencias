import '../estilos/Register.css';
import { useState } from 'react';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleRegister = async () => {
    if (!username || !password || !codigo) {
      setMensaje('Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/register`, {
        username,
        password,
        codigo: parseInt(codigo)
      });
      setMensaje('✅ Usuario registrado correctamente');
      setUsername('');
      setPassword('');
      setCodigo('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Error desconocido';
      setMensaje('❌ Error al registrar: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form">
      <h1>Registro de Usuario</h1>

      <div className="form-group">
        <input
          type="number"
          value={codigo}
          onChange={e => setCodigo(e.target.value)}
          placeholder="Código"
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Usuario"
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Contraseña"
        />
      </div>

      <button onClick={handleRegister} disabled={loading}>
        {loading ? 'Registrando...' : 'Registrar'}
      </button>

      {mensaje && (
        <p className={mensaje.startsWith('❌') ? 'error' : 'success'}>
          {mensaje}
        </p>
      )}
    </div>
  );
}

export default Register;
