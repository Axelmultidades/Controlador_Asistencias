<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GestionarAulas extends Controller
{
    // 🟢 Crear aula
    public function store(Request $request)
    {
        // Validar los datos recibidos
        $request->validate([
            'numero' => 'required|integer|unique:aula,numero', // número único de aula
            'id_piso' => 'required|integer|min:1',              // piso debe ser entero y mayor a 0
            'estado' => 'required|string|max:20',               // estado como texto corto
        ]);

        // Insertar aula en la base de datos y obtener su ID
        $id = DB::table('aula')->insertGetId([
            'numero' => $request->numero,
            'id_piso' => $request->id_piso,
            'estado' => $request->estado,
        ]);

        // Respuesta JSON con éxito y el ID generado
        return response()->json([
            'success' => true,
            'message' => 'Aula registrada correctamente',
            'aula_id' => $id
        ]);
    }

    // 📋 Listar todas las aulas
    public function index()
    {
        // Obtener todas las aulas ordenadas por número
        $aulas = DB::table('aula')->orderBy('numero')->get();

        // Respuesta JSON con la lista de aulas
        return response()->json([
            'success' => true,
            'data' => $aulas
        ]);
    }

    // 🔍 Buscar aulas por estado
    public function show($estado)
    {
        // Filtrar aulas por estado (ej. 'disponible', 'ocupada')
        $aulas = DB::table('aula')->where('estado', $estado)->get();

        // Si no se encuentran aulas con ese estado
        if ($aulas->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No se encontraron aulas con estado: ' . $estado
            ], 404); // Código HTTP 404: no encontrado
        }

        // Si hay resultados, devolverlos
        return response()->json([
            'success' => true,
            'data' => $aulas
        ]);
    }

    // ✏️ Editar aula existente
    public function update(Request $request, $id)
    {
        // Validar los datos recibidos
        $request->validate([
            'numero' => 'required|integer|unique:aula,numero,' . $id, // número único excepto el actual
            'id_piso' => 'required|integer|min:1',
            'estado' => 'required|string|max:20',
        ]);

        // Actualizar los datos del aula en la base de datos
        DB::table('aula')->where('id', $id)->update([
            'numero' => $request->numero,
            'id_piso' => $request->id_piso,
            'estado' => $request->estado,
        ]);

        // Respuesta JSON confirmando la actualización
        return response()->json([
            'success' => true,
            'message' => 'Aula actualizada correctamente'
        ]);
    }

    // 🗑️ Eliminar aula
    public function destroy($id)
    {
        // Verificar si el aula existe
        $aula = DB::table('aula')->where('id', $id)->first();

        if (!$aula) {
            return response()->json([
                'success' => false,
                'message' => 'Aula no encontrada'
            ], 404); // Código HTTP 404: no encontrado
        }

        // Verificar si el aula está asignada a alguna clase
        $aulaUsada = DB::table('clase')->where('id_aula', $id)->exists();

        if ($aulaUsada) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar: el aula está asignada a una clase'
            ], 403); // Código HTTP 403: acción prohibida
        }

        // Eliminar el aula si no está en uso
        DB::table('aula')->where('id', $id)->delete();

        // Respuesta JSON confirmando la eliminación
        return response()->json([
            'success' => true,
            'message' => 'Aula eliminada correctamente'
        ]);
    }
 public function disponibles(Request $request)
{
    // Normalizar el día antes de validar
    $request->merge([
        'dia' => strtolower($request->input('dia'))
    ]);

    // Validar entrada
    $request->validate([
        'dia'          => 'required|string|in:lunes,martes,miercoles,jueves,viernes,sabado,domingo',
        'hora_inicio'  => 'required|date_format:H:i',
        'hora_final'   => 'required|date_format:H:i|after:hora_inicio',
    ]);

    $dia          = $request->dia;
    $hora_inicio  = $request->hora_inicio;
    $hora_final   = $request->hora_final;

    // Buscar horarios que se cruzan con el rango solicitado
    $horarios_ocupados = DB::table('horario')
        ->whereRaw('LOWER(dia) = ?', [$dia])
        ->where(function ($query) use ($hora_inicio, $hora_final) {
            $query->whereBetween('hora_inicial', [$hora_inicio, $hora_final])
                  ->orWhereBetween('hora_final', [$hora_inicio, $hora_final])
                  ->orWhere(function ($q) use ($hora_inicio, $hora_final) {
                      $q->where('hora_inicial', '<=', $hora_inicio)
                        ->where('hora_final', '>=', $hora_final);
                  });
        })
        ->pluck('id');

    // Buscar aulas ocupadas en esos horarios
    $aulas_ocupadas = DB::table('clase')
        ->whereIn('id_horario', $horarios_ocupados)
        ->pluck('id_aula');

    // Devolver aulas no ocupadas
    $aulas_disponibles = DB::table('aula')
        ->whereNotIn('id', $aulas_ocupadas)
        ->orderBy('numero')
        ->get();

    return response()->json([
        'success' => true,
        'data' => $aulas_disponibles
    ]);
}



}
