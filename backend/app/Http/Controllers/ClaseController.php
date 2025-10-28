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
        'ci_profesor' => 'required|exists:profesor,ci',
        'id_aula' => 'required|exists:aula,id',
        'fecha' => 'required|date',
        'id_horario' => 'nullable|exists:horario,id',
    ]);

    // Insertar clase
    $clase_id = DB::table('clase')->insertGetId([
        'id_profesor_materia_grupo' => $request->id_profesor_materia_grupo,
        'id_aula' => $request->id_aula,
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
}
