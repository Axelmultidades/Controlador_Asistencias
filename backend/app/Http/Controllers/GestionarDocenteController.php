<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GestionarDocenteController extends Controller
{
    // ✏️ Actualizar datos de un docente por su CI
    public function update(Request $request, $ci)
    {
        // Validar los campos recibidos
        $request->validate([
            'nombre' => 'required|string|max:20',     // nombre obligatorio, máximo 20 caracteres
            'telefono' => 'nullable|integer',         // teléfono opcional, debe ser entero si se envía
        ]);

        // Buscar al docente por CI
        $profesor = DB::table('profesor')->where('ci', $ci)->first();

        // Si no existe, devolver error 404
        if (!$profesor) {
            return response()->json([
                'success' => false,
                'message' => 'Docente no encontrado'
            ], 404);
        }

        // Actualizar los datos del docente
        DB::table('profesor')->where('ci', $ci)->update([
            'nombre' => $request->input('nombre'),
            'telefono' => $request->input('telefono'),
        ]);

        // Obtener los datos actualizados
        $actualizado = DB::table('profesor')->where('ci', $ci)->first();

        // Devolver respuesta con los nuevos datos
        return response()->json([
            'success' => true,
            'message' => 'Docente actualizado correctamente',
            'data' => $actualizado
        ]);
    }

    // 🔍 Mostrar datos de un docente por CI
    public function show($ci)
    {
        // Buscar al docente
        $profesor = DB::table('profesor')->where('ci', $ci)->first();

        // Si no existe, devolver error
        if (!$profesor) {
            return response()->json([
                'success' => false,
                'message' => 'Docente no encontrado'
            ], 404);
        }

        // Devolver datos del docente
        return response()->json([
            'success' => true,
            'data' => $profesor
        ]);
    }

    // 🗑️ Eliminar docente por CI
    public function destroy($ci)
    {
        try {
            // Validar que el CI sea numérico
            if (!is_numeric($ci)) {
                return response()->json(['success' => false, 'message' => 'CI inválido'], 400);
            }

            // Verificar si el docente existe
            $profesor = DB::table('profesor')->where('ci', $ci)->first();

            if (!$profesor) {
                return response()->json(['success' => false, 'message' => 'Docente no encontrado'], 404);
            }

            // Verificar si tiene clases asignadas
            $tieneClases = DB::table('clase')->where('ci_profesor', $ci)->exists();

            if ($tieneClases) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar: el docente tiene clases asignadas'
                ], 403);
            }

            // Eliminar docente
            DB::table('profesor')->where('ci', $ci)->delete();

            return response()->json(['success' => true, 'message' => 'Docente eliminado correctamente']);
        } catch (\Exception $e) {
            // Capturar errores internos
            return response()->json([
                'success' => false,
                'message' => 'Error interno al eliminar el docente',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // 🟢 Registrar nuevo docente
    public function store(Request $request)
    {
        // Validar los datos recibidos
        $request->validate([
            'ci' => 'required|integer|unique:profesor,ci', // CI único y obligatorio
            'nombre' => 'required|string|max:20',
            'telefono' => 'nullable|integer',
        ]);

        // Insertar nuevo docente
        DB::table('profesor')->insert([
            'ci' => $request->input('ci'),
            'nombre' => $request->input('nombre'),
            'telefono' => $request->input('telefono'),
        ]);

        // Obtener el docente recién creado
        $nuevo = DB::table('profesor')->where('ci', $request->input('ci'))->first();

        // Devolver respuesta con los datos
        return response()->json([
            'success' => true,
            'message' => 'Docente registrado correctamente',
            'data' => $nuevo
        ]);
    }

    // 📋 Listar docentes con búsqueda opcional
    public function index(Request $request)
    {
        // Iniciar consulta base
        $query = DB::table('profesor');

        // Si se envía parámetro 'buscar', aplicar filtro
        if ($request->has('buscar')) {
            $buscar = $request->input('buscar');
            $query->where(function ($q) use ($buscar) {
                $q->whereRaw("nombre ILIKE ?", ["%$buscar%"]) // búsqueda insensible a mayúsculas
                  ->orWhereRaw("CAST(ci AS TEXT) ILIKE ?", ["%$buscar%"]);
            });
        }

        // Ordenar y paginar resultados
        $docentes = $query->orderBy('nombre')->paginate(10);

        // Devolver lista paginada
        return response()->json([
            'success' => true,
            'data' => $docentes
        ]);
    }

    // 📚 Obtener materias asignadas a un docente
    public function Docente_Materia($ci)
    {
        // Consultar materias asociadas al docente por CI
        $materias = DB::table('materia')
            ->join('profesor_materia', 'materia.id', '=', 'profesor_materia.id_materia')
            ->join('profesor', 'profesor.ci', '=', 'profesor_materia.ci_profesor')
            ->where('profesor_materia.ci_profesor', $ci)
            ->select('materia.nombre', 'profesor.nombre as docente')
            ->distinct()
            ->get();

        // Devolver lista de materias
        return response()->json([
            'success' => true,
            'data' => $materias
        ]);
    }
}
