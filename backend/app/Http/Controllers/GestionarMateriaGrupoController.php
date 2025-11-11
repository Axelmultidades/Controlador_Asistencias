<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GestionarMateriaGrupoController extends Controller
{
    // 🟢 Crear nueva materia
    public function crearMateria(Request $request)
    {
        // Validar que el nombre sea único y no exceda 50 caracteres
        $request->validate([
            'nombre' => 'required|string|max:50|unique:materia,nombre',
        ]);

        // Insertar materia y obtener su ID
        $materia_id = DB::table('materia')->insertGetId([
            'nombre' => $request->nombre,
        ]);

        // Respuesta con éxito y ID generado
        return response()->json([
            'success' => true,
            'message' => 'Materia creada correctamente',
            'materia_id' => $materia_id
        ]);
    }

    // 📎 Asignar grupo a una relación profesor-materia
    public function asignarGrupo(Request $request, $id_profesor_materia)
    {
        // Validar nombre del grupo
        $request->validate([
            'nombre' => 'required|string|max:10',
        ]);

        // Buscar si el grupo ya existe
        $grupo = DB::table('grupo')->where('nombre', $request->nombre)->first();

        // Si no existe, lo crea y obtiene su ID
        $grupo_id = $grupo ? $grupo->id : DB::table('grupo')->insertGetId([
            'nombre' => $request->nombre,
        ]);

        // Verificar si ya está asignado
        $existe = DB::table('profesor_materia_grupo')
            ->where('id_profesor_materia', $id_profesor_materia)
            ->where('id_grupo', $grupo_id)
            ->exists();

        if ($existe) {
            return response()->json([
                'success' => false,
                'message' => 'Este grupo ya está asignado a esta relación profesor-materia'
            ], 409); // Conflicto
        }

        // Asignar grupo a la relación
        DB::table('profesor_materia_grupo')->insert([
            'id_profesor_materia' => $id_profesor_materia,
            'id_grupo' => $grupo_id,
        ]);

        // Respuesta según si el grupo fue creado o ya existía
        return response()->json([
            'success' => true,
            'message' => $grupo ? 'Grupo existente asignado correctamente' : 'Grupo creado y asignado correctamente',
            'grupo_id' => $grupo_id
        ]);
    }

    // ✏️ Editar nombre de una materia
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

    // 🗑️ Eliminar materia y sus relaciones
    public function eliminarMateria($id)
    {
        try {
            // Eliminar relaciones con profesor
            DB::table('profesor_materia')->where('id_materia', $id)->delete();
            // Eliminar la materia
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

    // 🗑️ Eliminar grupo y sus asignaciones
    public function eliminarGrupo($id)
    {
        DB::table('profesor_materia_grupo')->where('id_grupo', $id)->delete();
        DB::table('grupo')->where('id', $id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Grupo eliminado correctamente'
        ]);
    }

    // 🔄 Desasignar grupo de una relación profesor-materia
    public function desasignarGrupo($id_profesor_materia, $id_grupo)
    {
        DB::table('profesor_materia_grupo')
            ->where('id_profesor_materia', $id_profesor_materia)
            ->where('id_grupo', $id_grupo)
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Grupo desasignado correctamente'
        ]);
    }

    // ✏️ Editar nombre de grupo
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

    // 📋 Ver todas las asignaciones profesor-materia
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

    // 📋 Ver todos los grupos existentes
    public function verGrupos()
    {
        $grupos = DB::table('grupo')->select('id', 'nombre')->get();

        return response()->json([
            'success' => true,
            'data' => $grupos
        ]);
    }

    // 📚 Ver materias con sus grupos asignados
    public function verMateriasConGrupos()
    {
        // Obtener datos combinados de profesor, materia y grupo
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

        // Agrupar resultados por materia
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

        // Devolver datos agrupados
        return response()->json([
            'success' => true,
            'data' => array_values($resultado)
        ]);
    }
    // ➕ Asignar materia a profesor
    public function asignarMateriaAProfesor(Request $request)
{
    // Validar entrada
    $request->validate([
        'ci_profesor' => 'required|integer|exists:profesor,ci',
        'id_materia' => 'required|integer|exists:materia,id',
    ]);

    // Verificar si ya existe la asignación
    $existe = DB::table('profesor_materia')
        ->where('ci_profesor', $request->ci_profesor)
        ->where('id_materia', $request->id_materia)
        ->exists();

    if ($existe) {
        return response()->json([
            'success' => false,
            'message' => 'La materia ya está asignada a este profesor'
        ], 409); // Conflicto
    }

    // Insertar nueva relación
    $id = DB::table('profesor_materia')->insertGetId([
        'ci_profesor' => $request->ci_profesor,
        'id_materia' => $request->id_materia,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Materia asignada correctamente al profesor',
        'relacion_id' => $id
    ]);
}
public function listarMaterias()
{
    $materias = DB::table('materia')
        ->select('id', 'nombre')
        ->orderBy('nombre')
        ->get();

    return response()->json([
        'success' => true,
        'data' => $materias
    ]);
}

}
