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

        $materia_id = DB::table('materia')->insertGetId([
            'nombre' => $request->nombre,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Materia creada correctamente',
            'materia_id' => $materia_id
        ]);
    }

    public function asignarGrupo(Request $request, $id_profesor_materia)
    {
        $request->validate([
            'nombre' => 'required|string|max:10',
        ]);

        $grupo = DB::table('grupo')->where('nombre', $request->nombre)->first();

        $grupo_id = $grupo ? $grupo->id : DB::table('grupo')->insertGetId([
            'nombre' => $request->nombre,
        ]);

        $existe = DB::table('profesor_materia_grupo')
            ->where('id_profesor_materia_grupo', $id_profesor_materia)
            ->where('id_grupo', $grupo_id)
            ->exists();

        if ($existe) {
            return response()->json([
                'success' => false,
                'message' => 'Este grupo ya está asignado a esta relación profesor-materia'
            ], 409);
        }

        DB::table('profesor_materia_grupo')->insert([
            'id_profesor_materia_grupo' => $id_profesor_materia,
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
            DB::table('profesor_materia')->where('id_materia', $id)->delete();
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
        DB::table('profesor_materia_grupo')->where('id_grupo', $id)->delete();
        DB::table('grupo')->where('id', $id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Grupo eliminado correctamente'
        ]);
    }

    public function desasignarGrupo($id_profesor_materia, $id_grupo)
    {
        DB::table('profesor_materia_grupo')
            ->where('id_profesor_materia_grupo', $id_profesor_materia)
            ->where('id_grupo', $id_grupo)
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Grupo desasignado correctamente'
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
        $asignaciones = DB::table('profesor_materia')
        ->join('materia', 'profesor_materia.id_materia', '=', 'materia.id')
        ->join('profesor', 'profesor_materia.ci_profesor', '=', 'profesor.ci')
        ->select(
            'profesor_materia.id',
            'materia.nombre as materia_nombre',
            'profesor.nombre as profesor_nombre'
        )
        ->get();

    return response()->json([
        'success' => true,
        'data' => $asignaciones
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
    $datos = DB::table('profesor_materia_grupo')
        ->join('profesor_materia', 'profesor_materia_grupo.id_profesor_materia', '=', 'profesor_materia.id')
        ->join('profesor', 'profesor_materia.ci_profesor', '=', 'profesor.ci')
        ->join('materia', 'profesor_materia.id_materia', '=', 'materia.id')
        ->join('grupo', 'profesor_materia_grupo.id_grupo', '=', 'grupo.id')
        ->select(
            'materia.id as materia_id',
            'materia.nombre as materia_nombre',
            'profesor.nombre as profesor_nombre',
            'grupo.id as grupo_id',
            'grupo.nombre as grupo_nombre'
        )
        ->get();

    $resultado = [];

    foreach ($datos as $registro) {
        $materiaId = $registro->materia_id;

        if (!isset($resultado[$materiaId])) {
            $resultado[$materiaId] = [
                'id' => $materiaId,
                'nombre' => $registro->materia_nombre,
                'profesor' => $registro->profesor_nombre,
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