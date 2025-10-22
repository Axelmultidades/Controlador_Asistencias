<?php
use App\Http\Controllers\ProfesorController;
use Illuminate\Support\Facades\Route;


// Rutas API para las funciones
Route::get('/profesores', [ProfesorController::class, 'index']);
Route::get('/horario/{ci}', [ProfesorController::class, 'horario']);
Route::get('/test-db', function () {
    return \DB::select('SELECT 1 AS test');
});
