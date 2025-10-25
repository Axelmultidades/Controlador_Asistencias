import '../estilos/Login.css';
import { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, {
        codigo: parseInt(codigo),
        password
      }, { withCredentials: true });

      onLogin(response.data.usuario); // guarda el usuario en App o Context
      setMensaje('Inicio de sesión exitoso');
      setCodigo('');
      setPassword('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Credenciales inválidas';
      setMensaje('Error al iniciar sesión: ' + msg);
    }
  };

  return (
    <div className="container">
      <h1>Iniciar Sesión</h1>

      <input
        type="number"
        value={codigo}
        onChange={e => setCodigo(e.target.value)}
        placeholder="Código"
      />

      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Contraseña"
      />

      <button onClick={handleLogin}>Entrar</button>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default Login;
