
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
  <div className="flex h-screen bg-cover bg-center text-white" style={{ backgroundImage: "url('/imagenes/fondo.png')" }}>
    <div className="flex-1 flex items-center justify-center bg-black/40 text-4xl font-bold">
      BIENVENIDO
    </div>

    <div className="flex-1 flex items-center justify-center">
      <div className="bg-cyan-900/70 p-10 rounded-lg w-[90%] max-w-md box-border">
        <h2 className="text-xl mb-5 text-center font-semibold">Ingresar a su Cuenta</h2>

        <input
          type="number"
          value={codigo}
          onChange={e => setCodigo(e.target.value)}
          placeholder="Código"
          className="w-full p-3 mb-4 rounded text-white text-base"
        />

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full p-3 mb-4 rounded text-white text-base"
        />

        <button
          onClick={handleLogin}
          className="w-full p-3 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          Ingresar
        </button>

        {mensaje && (
          <p className="mt-3 text-center text-sm">{mensaje}</p>
        )}
      </div>
    </div>
  </div>
);

}

export default Login;
