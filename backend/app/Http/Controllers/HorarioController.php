<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class HorarioController extends Controller
{
    public function asignarHorario(Request $request)
{
    $request->validate([
        'clase_id' => 'required|exists:clase,id',
        'dia' => 'required|string',
        'hora_inicio' => 'required|date_format:H:i',
        'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
    ]);

    // ✅ Crear el horario
    $horario_id = DB::table('horario')->insertGetId([
        'hora_inicial' => $request->hora_inicio,
        'hora_final' => $request->hora_fin,
        'dia' => $request->dia,
    ]);

    // 🔍 Obtener datos de la clase
    $clase = DB::table('clase')->where('id', $request->clase_id)->first();

    if (!$clase) {
        return response()->json([
            'success' => false,
            'message' => 'Clase no encontrada'
        ], 404);
    }

    // 🔥 Validar conflicto: el aula ya está ocupada en ese horario
    $conflictoAula = DB::table('clase')
        ->join('horario', 'clase.id_horario', '=', 'horario.id')
        ->where('clase.id_aula', $clase->id_aula)
        ->where('horario.dia', $request->dia)
        ->where(function ($query) use ($request) {
            $query->whereBetween('horario.hora_inicial', [$request->hora_inicio, $request->hora_fin])
                  ->orWhereBetween('horario.hora_final', [$request->hora_inicio, $request->hora_fin])
                  ->orWhere(function ($q) use ($request) {
                      $q->where('horario.hora_inicial', '<', $request->hora_inicio)
                        ->where('horario.hora_final', '>', $request->hora_fin);
                  });
        })
        ->exists();

    if ($conflictoAula) {
        return response()->json([
            'success' => false,
            'message' => 'Conflicto: el aula ya está ocupada en ese horario'
        ], 409);
    }

    // 🔥 Validar conflicto: el docente ya tiene clase en ese horario
    $conflictoDocente = DB::table('clase')
        ->join('horario', 'clase.id_horario', '=', 'horario.id')
        ->where('clase.id_profesor_materia_grupo', $clase->id_profesor_materia_grupo)
        ->where('horario.dia', $request->dia)
        ->where(function ($query) use ($request) {
            $query->whereBetween('horario.hora_inicial', [$request->hora_inicio, $request->hora_fin])
                  ->orWhereBetween('horario.hora_final', [$request->hora_inicio, $request->hora_fin])
                  ->orWhere(function ($q) use ($request) {
                      $q->where('horario.hora_inicial', '<', $request->hora_inicio)
                        ->where('horario.hora_final', '>', $request->hora_fin);
                  });
        })
        ->exists();

    if ($conflictoDocente) {
        return response()->json([
            'success' => false,
            'message' => 'Conflicto: el docente ya tiene otra clase en ese horario'
        ], 409);
    }

    // ✅ Asignar el horario a la clase
    DB::table('clase')->where('id', $request->clase_id)->update([
        'id_horario' => $horario_id
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Horario asignado correctamente',
        'horario_id' => $horario_id
    ]);
}


    public function index()
{
    $horarios = DB::table('horario')->get();

    return response()->json([
        'success' => true,
        'data' => $horarios
    ]);
}

public function porProfesor($ci)
{
    $horarios = DB::table('clase')
        ->join('horario', 'clase.id_horario', '=', 'horario.id')
        ->join('profesor', 'clase.ci_profesor', '=', 'profesor.ci')
        ->join('profesor_materia', 'profesor.ci', '=', 'profesor_materia.ci_profesor')
        ->join('materia', 'profesor_materia.id_materia', '=', 'materia.id')
        ->where('clase.ci_profesor', $ci)
        ->select(
            'horario.dia',
            'horario.hora_inicial',
            'horario.hora_final',
            'materia.nombre as materia',
            'profesor.nombre as profesor'
        )
        ->get();

    return response()->json($horarios);
}

}
