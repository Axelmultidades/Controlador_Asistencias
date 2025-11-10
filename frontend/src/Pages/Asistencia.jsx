import QrAsistencia from "../componentes/Asistencia/QR";

export default function Asistencia() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Asistencia mediante QR</h1>
      <div className="flex justify-center">
        <QrAsistencia />
      </div>
    </div>
  );
}