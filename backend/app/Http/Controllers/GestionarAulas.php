<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class GestionarAulas extends Controller
{// Crear aula
    public function store(Request $request)
{
    $request->validate([
        'numero' => 'required|integer|unique:aula,numero',
        'id_piso' => 'required|integer|min:1',
        'estado' => 'required|string|max:20',
    ]);

    $id = DB::table('aula')->insertGetId([
        'numero' => $request->numero,
        'id_piso' => $request->id_piso,
        'estado' => $request->estado,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Aula registrada correctamente',
        'aula_id' => $id
    ]);
}


    // Listar aulas
    public function index()
    {
        $aulas = DB::table('aula')->orderBy('numero')->get();

        return response()->json([
            'success' => true,
            'data' => $aulas
        ]);
    }

    // Buscar aula por código
    public function show($estado)
{
    $aulas = DB::table('aula')->where('estado', $estado)->get();

    if ($aulas->isEmpty()) {
        return response()->json([
            'success' => false,
            'message' => 'No se encontraron aulas con estado: ' . $estado
        ], 404);
    }

    return response()->json([
        'success' => true,
        'data' => $aulas
    ]);
}

    // Editar aula
    public function update(Request $request, $id)
{
    $request->validate([
        'numero' => 'required|integer|unique:aula,numero,' . $id,
        'id_piso' => 'required|integer|min:1',
        'estado' => 'required|string|max:20',
    ]);

    DB::table('aula')->where('id', $id)->update([
        'numero' => $request->numero,
        'id_piso' => $request->id_piso,
        'estado' => $request->estado,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Aula actualizada correctamente'
    ]);
}


    // Eliminar aula
    public function destroy($id)
{
    // Verificar si el aula existe
    $aula = DB::table('aula')->where('id', $id)->first();

    if (!$aula) {
        return response()->json([
            'success' => false,
            'message' => 'Aula no encontrada'
        ], 404);
    }

    // Verificar si el aula está asignada a alguna clase
    $aulaUsada = DB::table('clase')->where('id_aula', $id)->exists();

    if ($aulaUsada) {
        return response()->json([
            'success' => false,
            'message' => 'No se puede eliminar: el aula está asignada a una clase'
        ], 403);
    }

    // Eliminar el aula
    DB::table('aula')->where('id', $id)->delete();

    return response()->json([
        'success' => true,
        'message' => 'Aula eliminada correctamente'
    ]);
}


}
