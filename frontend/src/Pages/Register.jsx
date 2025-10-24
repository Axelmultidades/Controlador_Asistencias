import '../estilos/Register.css';
import { useState } from 'react';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:8000/api/register', {
        username,
        password,
        codigo: parseInt(codigo)
      });
      setMensaje('Usuario registrado correctamente');
      setUsername('');
      setPassword('');
      setCodigo('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Error desconocido';
      setMensaje('Error al registrar: ' + msg);
    }
  };

  return (
    <div className="container">
      <h1>Registro de Usuario</h1>

      <input
        type="number"
        value={codigo}
        onChange={e => setCodigo(e.target.value)}
        placeholder="Código"
      />

      <input
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Usuario"
      />

      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Contraseña"
      />

      <button onClick={handleRegister}>Registrar</button>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default Register;
