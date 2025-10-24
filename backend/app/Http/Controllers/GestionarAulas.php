<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class GestionarAulas extends Controller
{// Crear aula
    public function store(Request $request)
    {
        $request->validate([
            'codigo' => 'required|string|max:10|unique:aula,codigo',
            'capacidad' => 'required|integer|min:1',
            'tipo' => 'nullable|string|max:20', // opcional: laboratorio, teórica, etc.
        ]);

        $id = DB::table('aula')->insertGetId([
            'codigo' => $request->codigo,
            'capacidad' => $request->capacidad,
            'tipo' => $request->tipo,
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
        $aulas = DB::table('aula')->orderBy('codigo')->get();

        return response()->json([
            'success' => true,
            'data' => $aulas
        ]);
    }

    // Buscar aula por código
    public function show($codigo)
    {
        $aula = DB::table('aula')->where('codigo', $codigo)->first();

        if (!$aula) {
            return response()->json([
                'success' => false,
                'message' => 'Aula no encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $aula
        ]);
    }

    // Editar aula
    public function update(Request $request, $id)
    {
        $request->validate([
            'codigo' => 'required|string|max:10|unique:aula,codigo,' . $id,
            'capacidad' => 'required|integer|min:1',
            'tipo' => 'nullable|string|max:20',
        ]);

        DB::table('aula')->where('id', $id)->update([
            'codigo' => $request->codigo,
            'capacidad' => $request->capacidad,
            'tipo' => $request->tipo,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Aula actualizada correctamente'
        ]);
    }

    // Eliminar aula
    public function destroy($id)
    {
        $tieneHorarios = DB::table('horario')->where('aula_id', $id)->exists();

        if ($tieneHorarios) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar: el aula tiene horarios asignados'
            ], 403);
        }

        DB::table('aula')->where('id', $id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Aula eliminada correctamente'
        ]);
    }
}
