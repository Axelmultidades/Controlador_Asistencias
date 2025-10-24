<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\ProfesorController;
use App\Http\Controllers\GestionarDocenteController;
use App\Http\Controllers\GestionarAulas; // ✅ corregido
use App\Http\Controllers\HorarioController; // ✅ corregido
// Rutas API para funciones de profesor
Route::get('/horario/{ci}', [ProfesorController::class, 'horario']);
Route::get('/profesores', [ProfesorController::class, 'index']);
// Rutas API para autenticación de usuarios
Route::post('/login', [UsuarioController::class, 'login']);
Route::post('/logout', [UsuarioController::class, 'logout']);
Route::post('/register', [UsuarioController::class, 'register']);

// Rutas API de gestionar docentes
Route::get('/profesor', [GestionarDocenteController::class, 'index']);
Route::post('/profesor', [GestionarDocenteController::class, 'store']);
Route::get('/profesor/{ci}', [GestionarDocenteController::class, 'show']);
Route::put('/profesor/{ci}', [GestionarDocenteController::class, 'update']);
Route::delete('/profesor/{ci}', [GestionarDocenteController::class, 'destroy']);
Route::get('/profesor/{ci}/materias', [GestionarDocenteController::class, 'Docente_Materia']);

// Rutas API de gestionar aulas
Route::prefix('aula')->group(function () {
    Route::post('/', [GestionarAulas::class, 'store']);
    Route::get('/', [GestionarAulas::class, 'index']);
    Route::get('/{codigo}', [GestionarAulas::class, 'show']);
    Route::put('/{id}', [GestionarAulas::class, 'update']);
    Route::delete('/{id}', [GestionarAulas::class, 'destroy']);
});

// Rutas API de gestionar horarios
Route::prefix('horario')->group(function () {
    Route::post('/', [HorarioController::class, 'store']); // Asignar horario (CU06 + CU07)
    Route::get('/', [HorarioController::class, 'index']); // Listar todos los horarios
    Route::get('/docente/{ci}', [HorarioController::class, 'porDocente']); // Horarios por docente
    Route::get('/grupo/{grupo_id}', [HorarioController::class, 'porGrupo']); // Horarios por grupo
    Route::get('/aula/{aula_id}', [HorarioController::class, 'porAula']); // Horarios por aula
    Route::put('/{id}', [HorarioController::class, 'update']); // Editar horario
    Route::delete('/{id}', [HorarioController::class, 'destroy']); // Eliminar horario
});
// Ruta de prueba de conexión a la base de datos
Route::get('/test-db', function () {
    return \DB::select('SELECT 1 AS test');
});
