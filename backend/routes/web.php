<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfesorController;

// Ruta de prueba para verificar conexión con la base de datos
Route::get('/test-db', function () {
    return \DB::select('SELECT 1 AS test');
});

// Ruta para listar profesores
Route::get('/api/profesores', [ProfesorController::class, 'index']);
Route::get('/api/horario/{ci}', [ProfesorController::class, 'horario']);