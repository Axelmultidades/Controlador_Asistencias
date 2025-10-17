<?php

namespace App\Http\Controllers;

use App\Models\Profesor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProfesorController extends Controller
{
    public function index()
    {
        return response()->json(Profesor::all());
    }
    public function horario($ci)
    {
    $horario = DB::table('clase')
        ->join('horario', 'clase.id_horario', '=', 'horario.id')
        ->join('materias', 'clase.id_materia', '=', 'materias.id')
        ->where('clase.ci_profesor', $ci)
        ->select('horario.dia', 'horario.hora_inicial', 'horario.hora_final', 'materias.nombre as materia')
        ->orderBy('horario.dia')
        ->orderBy('horario.hora_inicial')
        ->get();

    return response()->json($horario);
    }
}
