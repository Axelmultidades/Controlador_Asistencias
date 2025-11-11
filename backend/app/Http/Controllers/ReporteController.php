<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ReporteController extends Controller
{
    public function exportar(Request $request)
{
    // Validar filtros (opcional si no se usan)
    $request->validate([
        'ci_profesor' => 'nullable|integer',
        'id_materia' => 'nullable|integer',
        'fecha_inicio' => 'nullable|date',
        'fecha_fin' => 'nullable|date',
        'estado' => 'nullable|string',
    ]);

    // Construir la consulta con filtros
        $query = DB::table('asistencia')
            ->join('clase', 'asistencia.id_clase', '=', 'clase.id')
            ->join('profesor_materia_grupo', 'clase.id_profesor_materia_grupo', '=', 'profesor_materia_grupo.id')
            ->join('profesor_materia', 'profesor_materia_grupo.id_profesor_materia', '=', 'profesor_materia.id')
            ->join('materia', 'profesor_materia.id_materia', '=', 'materia.id')
            ->join('profesor', 'profesor_materia.ci_profesor', '=', 'profesor.ci')
            ->select(
                'profesor.nombre as nombre_profesor',
                'materia.nombre as nombre_materia',
                'clase.fecha as fecha_clase',
                'asistencia.estado'
            );

        // Aplicar filtros si existen
        if ($request->ci_profesor) {
            $query->where('profesor.ci', $request->ci_profesor);
        }

        if ($request->id_materia) {
            $query->where('materia.id', $request->id_materia);
        }

        if ($request->fecha_inicio && $request->fecha_fin) {
            $query->whereBetween('clase.fecha', [$request->fecha_inicio, $request->fecha_fin]);
        }

        if ($request->estado) {
            $query->where('asistencia.estado', $request->estado);
        }

        $asistencias = $query->get();

    // Crear Excel
    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();

    // Solo mostrar en A1
    $sheet->setCellValue('A1', 'Profesor');
    $sheet->setCellValue('B1', 'Materia');
    $sheet->setCellValue('C1', 'Fecha Clase');
    $sheet->setCellValue('D1', 'Estado');

    // Rellenar datos
    $rowNum = 2;
    foreach ($asistencias as $asistencia) {
        $sheet->setCellValue('A' . $rowNum, $asistencia->nombre_profesor);
        $sheet->setCellValue('B' . $rowNum, $asistencia->nombre_materia);
        $sheet->setCellValue('C' . $rowNum, $asistencia->fecha_clase);
        $sheet->setCellValue('D' . $rowNum, $asistencia->estado);
        $rowNum++;
    }
    // Ajustar ancho de columnas
        foreach (range('A', 'D') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }
    // Guardar y descargar
    $fileName = 'prueba2' . date('Y-m-d_H-i-s') . '.xlsx';
    $temp_file = sys_get_temp_dir() . '/' . $fileName;
    $writer = new Xlsx($spreadsheet);
    $writer->save($temp_file);

    return response()->download($temp_file, $fileName)->deleteFileAfterSend(true);
}
}
