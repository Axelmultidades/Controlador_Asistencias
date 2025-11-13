<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Laravel\Pail\ValueObjects\Origin\Console;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Carbon\Carbon;

class AsistenciaController extends Controller
{
    public function qr()
{
    $url = 'https://controladorasistencias-production-96e7.up.railway.app/registro_docente'; // o tu URL de React
    $qr = QrCode::format('svg')->size(300)->generate($url);

    return response($qr)->header('Content-Type', 'image/svg+xml');
}


   public function registrar(Request $request)
{
    $usuarioCI = $request->input('ci');

    if (!$usuarioCI) {
        return response()->json(['error' => 'No autenticado'], 401);
    }

    $diaActual = ucfirst(Carbon::now()->locale('es')->dayName);
    $horaActual = Carbon::now();
    $inicioTolerancia = $horaActual->copy()->subMinutes(15)->format('H:i:s');
    $finTolerancia = $horaActual->copy()->addMinutes(15)->format('H:i:s');

    // Buscar clases del docente para ese día y hora
    $clases = DB::table('clase')
        ->join('profesor_materia_grupo', 'clase.id_profesor_materia_grupo', '=', 'profesor_materia_grupo.id')
        ->join('profesor_materia', 'profesor_materia_grupo.id_profesor_materia', '=', 'profesor_materia.id')
        ->join('profesor', 'profesor_materia.ci_profesor', '=', 'profesor.ci')
        ->join('horario', 'clase.id_horario', '=', 'horario.id')
        ->where('profesor.ci', $usuarioCI)
        ->where('horario.dia', $diaActual)
        ->whereTime('horario.hora_inicial', '>=', $inicioTolerancia)
        ->whereTime('horario.hora_inicial', '<=', $finTolerancia)
        ->pluck('clase.id');

    if ($clases->isEmpty()) {
        return response()->json(['error' => 'No se encontraron clases en el margen de tolerancia'], 403);
    }

    // Verificar si ya registró asistencia
    $yaRegistrado = DB::table('asistencia')
        ->whereIn('id_clase', $clases)
        ->whereDate('fecha', Carbon::now()->toDateString())
        ->exists();

    if ($yaRegistrado) {
        return response()->json(['message' => 'Ya se registró asistencia hoy']);
    }

    // verificar si existe asistencia con id_clase
    $existe = DB::table('asistencia')
        ->whereIn('id_clase', $clases)
        ->exists();
    
    if ($existe) {
        //actualizar asistencia
        DB::table('asistencia')
            ->whereIn('id_clase', $clases)
            ->update([
                'fecha' => Carbon::now()->toDateString(),
                'estado' => 'Presente',
            ]);
        return response()->json(['message' => 'existe asistencia']);
    }
    return response()->json(['message' => 'Asistencia registrada dentro del margen de tolerancia']);
}



}
