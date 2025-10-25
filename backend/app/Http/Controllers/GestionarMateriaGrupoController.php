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

    // Buscar si el grupo ya existe
    $grupo = DB::table('grupo')->where('nombre', $request->nombre)->first();

    if ($grupo) {
        $grupo_id = $grupo->id;
    } else {
        // Crear grupo si no existe
        $grupo_id = DB::table('grupo')->insertGetId([
            'nombre' => $request->nombre,
        ]);
    }

    // Verificar si ya está asignado
    $existe = DB::table('materia_grupo')
        ->where('id_materia', $materia_id)
        ->where('id_grupo', $grupo_id)
        ->exists();

    if ($existe) {
        return response()->json([
            'success' => false,
            'message' => 'Este grupo ya está asignado a esta materia'
        ], 409);
    }

    // Asignar grupo a materia
    DB::table('materia_grupo')->insert([
        'id_materia' => $materia_id,
        'id_grupo' => $grupo_id,
    ]);

    return response()->json([
        'success' => true,
        'message' => $grupo ? 'Grupo existente asignado correctamente' : 'Grupo creado y asignado correctamente',
        'grupo_id' => $grupo_id
    ]);
}


    public function editarMateria(Request $request, $id)
{
    $request->validate([
        'nombre' => 'required|string|max:50|unique:materia,nombre,' . $id,
    ]);

    DB::table('materia')->where('id', $id)->update([
        'nombre' => $request->nombre,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Materia actualizada correctamente'
    ]);
}

   public function eliminarMateria($id)
{
    try {
        // Eliminar relaciones en la tabla intermedia primero
        DB::table('materia_grupo')->where('id_materia', $id)->delete();

        // Luego eliminar la materia
        DB::table('materia')->where('id', $id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Materia y sus relaciones eliminadas correctamente'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error al eliminar la materia',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function eliminarGrupo($id)
{
    // Eliminar relaciones en la tabla intermedia primero
    DB::table('materia_grupo')->where('id_grupo', $id)->delete();

    DB::table('grupo')->where('id', $id)->delete();

    return response()->json([
        'success' => true,
        'message' => 'Grupo eliminado correctamente'
    ]);
}
public function desasignarGrupo($materia_id, $grupo_id)
{
    DB::table('materia_grupo')
        ->where('id_materia', $materia_id)
        ->where('id_grupo', $grupo_id)
        ->delete();

    return response()->json([
        'success' => true,
        'message' => 'Grupo desasignado de la materia correctamente'
    ]);
}
public function editarGrupo(Request $request, $id)
{
    $request->validate([
        'nombre' => 'required|string|max:10|unique:grupo,nombre,' . $id,
    ]);

    DB::table('grupo')->where('id', $id)->update([
        'nombre' => $request->nombre,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Grupo actualizado correctamente'
    ]);
}

public function verMaterias()
{
    $materias = DB::table('materia')->select('id', 'nombre')->get();

    return response()->json([
        'success' => true,
        'data' => $materias
    ]);
}

public function verGrupos()
{
    $grupos = DB::table('grupo')->select('id', 'nombre')->get();

    return response()->json([
        'success' => true,
        'data' => $grupos
    ]);
}

    public function verMateriasConGrupos()
{
    $materiasConGrupos = DB::table('materia_grupo')
        ->join('materia', 'materia_grupo.id_materia', '=', 'materia.id')
        ->join('grupo', 'materia_grupo.id_grupo', '=', 'grupo.id')
        ->select(
            'materia.id as materia_id',
            'materia.nombre as materia_nombre',
            'grupo.id as grupo_id',
            'grupo.nombre as grupo_nombre'
        )
        ->get();

    // Agrupar por materia
    $resultado = [];

    foreach ($materiasConGrupos as $registro) {
        $materiaId = $registro->materia_id;

        if (!isset($resultado[$materiaId])) {
            $resultado[$materiaId] = [
                'id' => $materiaId,
                'nombre' => $registro->materia_nombre,
                'grupos' => [],
            ];
        }

        $resultado[$materiaId]['grupos'][] = [
            'id' => $registro->grupo_id,
            'nombre' => $registro->grupo_nombre,
        ];
    }

    return response()->json([
        'success' => true,
        'data' => array_values($resultado)
    ]);
}

}
