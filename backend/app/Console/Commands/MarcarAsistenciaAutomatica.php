<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
class MarcarAsistenciaAutomatica extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:marcar-asistencia-automatica';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
   public function handle()
{
    $fechaHoy = Carbon::now()->toDateString();

    // Buscar clases del día actual
    $clasesHoy = DB::table('clase')
        ->join('horario', 'clase.id_horario', '=', 'horario.id')
        ->where('clase.fecha',$fechaHoy)
        ->where('horario.dia', ucfirst(Carbon::now()->locale('es')->dayName))
        ->pluck('clase.id');

    foreach ($clasesHoy as $idClase) {
        $existe = DB::table('asistencia')
            ->where('id_clase', $idClase)
            //verificar si la fecha es null
            ->whereNull('fecha')
            ->exists();

        if ($existe) {
            DB::table('asistencia')
            ->where('id_clase', $idClase)
            ->update([
                'fecha' => $fechaHoy,
                'estado' => 'ausente',
            ]);
        }
    }

    $this->info('Asistencia automática registrada para clases sin presencia.');
}
}
