<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class GestionarMateriaGrupoController extends Controller
{
   public function crearMateria(Request $request)
{
    $request->validate([
        'nombre' => 'required|string|max:50|unique:materia,nombre',
    ]);

    $materia = DB::table('materia')->insertGetId([
        'nombre' => $request->nombre,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Materia creada correctamente',
        'materia_id' => $materia
    ]);
}

    public function asignarGrupo(Request $request, $materia_id)
{
    $request->validate([
        'nombre' => 'required|string|max:10',
    ]);

    // Crear grupo sin materia_id
    $grupo_id = DB::table('grupo')->insertGetId([
        'nombre' => $request->nombre,
    ]);

    // Verificar si ya está asignado
    $existe = DB::table('materia_grupo')
        ->where('materia_id', $materia_id)
        ->where('grupo_id', $grupo_id)
        ->exists();

    if ($existe) {
        return response()->json([
            'success' => false,
            'message' => 'Este grupo ya está asignado a esta materia'
        ], 409);
    }

    // Asignar grupo a materia
    DB::table('materia_grupo')->insert([
        'materia_id' => $materia_id,
        'grupo_id' => $grupo_id,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Grupo creado y asignado correctamente',
        'grupo_id' => $grupo_id
    ]);
}

}
