<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class ClaseClaseController extends Controller
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
        'ci_profesor' => $request->ci_profesor,
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
}
