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
        'aula_id' => 'required|exists:aula,id',
        'dia' => 'required|string',
        'hora_inicio' => 'required|date_format:H:i',
        'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
    ]);

    // 🔍 Obtener el docente de la clase
    $docente_ci = DB::table('clase')
        ->where('id', $request->clase_id)
        ->value('docente_ci');

    // 🔥 Validar conflicto: el docente ya está usando esa aula en ese horario
    $conflicto = DB::table('horario')
        ->join('clase', 'horario.clase_id', '=', 'clase.id')
        ->where('horario.dia', $request->dia)
        ->where('horario.aula_id', $request->aula_id)
        ->where('clase.docente_ci', $docente_ci)
        ->where(function ($query) use ($request) {
            $query->whereBetween('horario.hora_inicio', [$request->hora_inicio, $request->hora_fin])
                  ->orWhereBetween('horario.hora_fin', [$request->hora_inicio, $request->hora_fin])
                  ->orWhere(function ($q) use ($request) {
                      $q->where('horario.hora_inicio', '<', $request->hora_inicio)
                        ->where('horario.hora_fin', '>', $request->hora_fin);
                  });
        })
        ->exists();

    if ($conflicto) {
        return response()->json([
            'success' => false,
            'message' => 'Conflicto detectado: el docente ya está usando esa aula en ese horario'
        ], 409);
    }

    // ✅ Insertar horario
    DB::table('horario')->insert([
        'clase_id' => $request->clase_id,
        'aula_id' => $request->aula_id,
        'dia' => $request->dia,
        'hora_inicio' => $request->hora_inicio,
        'hora_fin' => $request->hora_fin,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Horario asignado correctamente'
    ]);
}

    
}
