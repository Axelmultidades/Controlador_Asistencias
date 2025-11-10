export default function QrAsistencia() {
  const API_URL = import.meta.env.VITE_API_URL;

  return (
    <div>
      <h2>Escanea para registrar asistencia</h2>
      <img src={`${API_URL}/api/qr`} alt="QR asistencia" />
    </div>
  );
}
