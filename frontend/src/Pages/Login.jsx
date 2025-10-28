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

      onLogin(response.data.usuario);
      setMensaje('Inicio de sesión exitoso');
      setCodigo('');
      setPassword('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Credenciales inválidas';
      setMensaje('Error al iniciar sesión: ' + msg);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <h1>BIENVENIDO</h1>
      </div>
      <div className="login-right">
        <div className="login-form">
          <h2>Ingresar a su Cuenta</h2>
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
          <button onClick={handleLogin}>Ingresar</button>
          {mensaje && <p>{mensaje}</p>}
        </div>
      </div>
    </div>
  );
}

export default Login;
