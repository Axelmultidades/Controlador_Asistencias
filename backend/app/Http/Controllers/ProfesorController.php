<?php

namespace App\Http\Controllers;

use App\Models\Profesor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProfesorController extends Controller
{
    // Obtener la lista de todos los profesores
    public function index()
    {
        return response()->json(Profesor::all());
    }
    // Obtener el horario de un profesor por su CI
    public function horario($ci)
{
    $horario = DB::table('clase')
        ->join('horario', 'clase.id_horario', '=', 'horario.id')
        ->join('materias', 'clase.id_materia', '=', 'materias.id')
        ->join('profesor', 'clase.ci_profesor', '=', 'profesor.ci')
        ->where('clase.ci_profesor', $ci)
        ->select(
            'horario.dia',
            'horario.hora_inicial',
            'horario.hora_final',
            'materias.nombre as materia',
            'profesor.nombre as profesor'
        )
        ->orderByRaw('horario.dia, horario.hora_inicial')
        ->get();

        return response()->json($horario);
    }

}
