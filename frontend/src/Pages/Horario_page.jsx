import { useState } from 'react';
import HorarioProfesor from '../componentes/Horario_profesor';
function HorarioPage() {
  const [ci, setCi] = useState('');

  return (
    <div>
      <input
        type="text"
        placeholder="CI del profesor"
        value={ci}
        onChange={e => setCi(e.target.value)}
      />
      {ci && <HorarioProfesor ci={ci} />}
    </div>
  );
}
export default HorarioPage;