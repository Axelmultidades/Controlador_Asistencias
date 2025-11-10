import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RegistrarAsistencia({ usuario }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    console.log('RegistrarAsistencia montado con usuario:', usuario);

    if (!usuario || !usuario.ci_profesor) {
      console.warn('Usuario no disponible para registrar asistencia');
      navigate('/error');
      return;
    }

    axios.post(`${API_URL}/api/asistencia/docente`, {
      ci: usuario.ci_profesor,
    })
      .then((res) => {
        console.log('✅ Asistencia registrada:', res.data);
        navigate('/confirmacion');
      })
      .catch((err) => {
        console.error('❌ Error al registrar asistencia:', err);
        navigate('/error');
      });
  }, [usuario]);

  return null;
}
