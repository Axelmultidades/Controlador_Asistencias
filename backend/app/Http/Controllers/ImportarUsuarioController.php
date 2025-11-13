<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ImportarUsuarioController extends Controller
{
    /**
     * Importa usuarios desde un archivo Excel (.xlsx, .xls, .csv)
     * El archivo debe tener encabezado y columnas en este orden:
     * username | codigo | password | tipo_usuario | ci | nombre_profesor | telefono_profesor
     */
    public function importar(Request $request)
    {
        // Validar que se haya enviado un archivo válido
        $request->validate([
            'archivo' => 'required|file|mimes:xlsx,xls,csv',
        ]);

        // Cargar el archivo Excel usando PhpSpreadsheet
        $spreadsheet = IOFactory::load($request->file('archivo')->getPathname());
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray();

        // Recorrer cada fila del archivo
        foreach ($rows as $index => $row) {
            if ($index === 0) continue; // Saltar la fila de encabezado

            // Extraer datos de la fila
            $username = $row[0];
            $codigo   = $row[1];
            $password = $row[2];
            $tipo     = strtolower(trim($row[3])); // Normalizar tipo de usuario
            $ci       = $row[4] ?? null;
            $nombre   = $row[5] ?? null;
            $telefono = $row[6] ?? null;

            // Si el usuario es docente, verificar si el profesor ya existe
            if ($tipo === 'docente' && $ci) {
                $profesor = DB::table('profesor')->where('ci', $ci)->first();

                // Si no existe, lo creamos
                if (!$profesor) {
                    DB::table('profesor')->insert([
                        'ci' => $ci,
                        'nombre' => $nombre,
                        'telefono' => $telefono,
                    ]);
                }
            }

            // Verificar si el usuario ya existe por su código
            $usuario = DB::table('usuario')->where('codigo', $codigo)->first();

            if (!$usuario) {
                // Crear nuevo usuario
                $usuario_id = DB::table('usuario')->insertGetId([
                    'username'     => $username,
                    'codigo'       => $codigo,
                    'password'     => Hash::make($password),
                    'ci_profesor'  => $tipo === 'docente' ? $ci : null, // Solo si es docente
                ]);
            } else {
                // Actualizar usuario existente (opcional)
                $usuario_id = $usuario->id;
                DB::table('usuario')->where('id', $usuario_id)->update([
                    'ci_profesor' => $tipo === 'docente' ? $ci : null,
                ]);
            }

            // Asignar rol al usuario si existe en la tabla 'rol'
            $rol = DB::table('rol')->where('nombre', $tipo)->first();
            if (!$rol) {
                // Si no existe, lo creamos
                $rol_id = DB::table('rol')->insertGetId([
                'nombre' => $tipo,
                ]);
            } else {
                // Si existe, usamos su ID
                $rol_id = $rol->id;
            }
            // Asignar el rol al usuario
            DB::table('usuario_rol')->updateOrInsert([
            'id_usuario' => $usuario_id,
            'id_rol'     => $rol_id,
            ]);
        }

        // Respuesta final
        return response()->json([
            'success' => true,
            'message' => 'Importación completada correctamente',
        ]);
    }
}
