<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Profesor;
use Illuminate\Support\Facades\DB;
class GestionarDocenteController extends Controller
{
    public function update(Request $request, $ci)
    {
        $profesor = Profesor::findOrFail($ci);

        $request->validate([
        'nombre' => 'required|string|max:20',
        'telefono' => 'required|integer',
        ]);

        $profesor->update($request->only(['nombre', 'telefono']));

        return response()->json([
            'success' => true,
            'message' => 'Docente actualizado correctamente',
            'data' => $profesor
        ]);
    }
    public function show($ci)
    {
        $profesor = Profesor::find($ci);

        if (!$profesor) {
            return response()->json([
                'success' => false,
                'message' => 'Docente no encontrado'
            ], 404);
        }   

        return response()->json([
            'success' => true,
            'data' => $profesor
        ]);
    }
    

    

public function destroy($ci)
{
    try {
        if (!is_numeric($ci)) {
            return response()->json(['success' => false, 'message' => 'CI inválido'], 400);
        }

        $profesor = Profesor::find($ci);

        if (!$profesor) {
            return response()->json(['success' => false, 'message' => 'Docente no encontrado'], 404);
        }

        $tieneClases = DB::table('clase')->where('ci_profesor', $ci)->exists();

        if ($tieneClases) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar: el docente tiene clases asignadas'
            ], 403);
        }

        $profesor->delete();

        return response()->json(['success' => true, 'message' => 'Docente eliminado correctamente']);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error interno al eliminar el docente',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function store(Request $request)
{
    $request->validate([
        'ci' => 'required|integer|unique:profesor,ci',
        'nombre' => 'required|string|max:20',
        'telefono' => 'required|integer',
    ]);

    $profesor = Profesor::create($request->only(['ci', 'nombre', 'telefono']));

    return response()->json([
        'success' => true,
        'message' => 'Docente registrado correctamente',
        'data' => $profesor
    ]);
}

    public function index(Request $request)
{
    $query = Profesor::query();

    if ($request->has('buscar')) {
        $buscar = $request->input('buscar');
        $query->where(function ($q) use ($buscar) {
            $q->whereRaw("nombre ILIKE ?", ["%$buscar%"])
              ->orWhereRaw("CAST(ci AS TEXT) ILIKE ?", ["%$buscar%"]);
        });
    }

    $docentes = $query->orderBy('nombre')->paginate(10);

    return response()->json([
        'success' => true,
        'data' => $docentes
    ]);
}

    public function Docente_Materia($ci)
{
    $materias = DB::table('materia')
        ->join('profesor_materia', 'materia.id', '=', 'profesor_materia.id_materia')
        ->join('profesor', 'profesor.ci', '=', 'profesor_materia.ci_profesor') // ✅ este JOIN faltaba
        ->where('profesor_materia.ci_profesor', $ci)
        ->select('materia.nombre', 'profesor.nombre as docente')
        ->distinct()
        ->get();

    return response()->json([
        'success' => true,
        'data' => $materias
    ]);
}
}

