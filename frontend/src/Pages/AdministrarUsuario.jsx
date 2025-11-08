import React from 'react';
import CrearRol from '../componentes/AdministrarUsario/CrearRol.jsx';
import AsignarRol from '../componentes/AdministrarUsario/AsignarRol.jsx';
export default function AdministrarUsuario() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Administrar Usuarios</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CrearRol />
        <AsignarRol />
      </div>
    </div>
  );
}