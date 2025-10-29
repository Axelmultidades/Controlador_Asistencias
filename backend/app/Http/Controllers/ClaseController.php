<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class ClaseController extends Controller
{
    public function index()
{
    $clases = DB::table('clase')->get();

    return response()->json([
        'success' => true,
        'data' => $clases
    ]);
}

    public function store(Request $request)
{
    $request->validate([
        'id_profesor_materia_grupo' => 'required|integer',
        'numero_aula' => 'required|integer|exists:aula,numero',
        'fecha' => 'required|date',
        'id_horario' => 'nullable|exists:horario,id',
    ]);

    // Buscar el ID del aula por su número
    $aula = DB::table('aula')->where('numero', $request->numero_aula)->first();

    if (!$aula) {
        return response()->json([
            'success' => false,
            'message' => 'El número de aula no existe'
        ], 422);
    }

    // Insertar clase usando el ID del aula encontrado
    $clase_id = DB::table('clase')->insertGetId([
        'id_profesor_materia_grupo' => $request->id_profesor_materia_grupo,
        'id_aula' => $aula->id,
        'fecha' => $request->fecha,
        'id_horario' => $request->id_horario,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Clase creada correctamente',
        'clase_id' => $clase_id
    ]);
}
// Obtener aulas y docentes vinculados a clases
public function aula_docente()
{
    $clases = DB::table('clase')
        ->join('aula', 'clase.id_aula', '=', 'aula.id')
        ->join('profesor_materia_grupo', 'clase.id_profesor_materia_grupo', '=', 'profesor_materia_grupo.id')
        ->join('profesor_materia','profesor_materia_grupo.id_profesor_materia','=','profesor_materia.id')
        ->join('profesor', 'profesor_materia.ci_profesor', '=', 'profesor.ci')
        ->select(
            'clase.id',
            'aula.numero as numero_aula',
            'profesor.ci as ci_profesor'
        )
        ->get();

    return response()->json([
        'success' => true,
        'data' => $clases
    ]);
}
// Listar relaciones profesor-materia-grupo
public function listarRelacionesPMG()
{
    $datos = DB::table('profesor_materia_grupo')
        ->join('profesor_materia', 'profesor_materia_grupo.id_profesor_materia', '=', 'profesor_materia.id')
        ->join('profesor', 'profesor_materia.ci_profesor', '=', 'profesor.ci')
        ->join('materia', 'profesor_materia.id_materia', '=', 'materia.id')
        ->join('grupo', 'profesor_materia_grupo.id_grupo', '=', 'grupo.id')
        ->select(
            'profesor_materia_grupo.id as id',
            'profesor.nombre as profesor',
            'materia.nombre as materia',
            'grupo.nombre as grupo'
        )
        ->get();

    return response()->json([
        'success' => true,
        'data' => $datos
    ]);
}
}
