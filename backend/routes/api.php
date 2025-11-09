<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
//use App\Http\Controllers\ProfesorController;
use App\Http\Controllers\GestionarDocenteController;
use App\Http\Controllers\GestionarAulas; // ✅ corregido
use App\Http\Controllers\HorarioController; // ✅ corregido
use App\Http\Controllers\GestionarMateriaGrupoController;
use App\Http\Controllers\ClaseController;
use App\Http\Controllers\ImportarUsuarioController;

use App\Http\Controllers\AdministrarUsuario;
// Rutas API para funciones de profesor
//Route::get('/horario/{ci}', [ProfesorController::class, 'horario']);
//Route::get('/profesores', [ProfesorController::class, 'index']);
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
    Route::get('/disponibles', [GestionarAulas::class, 'disponibles']);
    #Route::get('/{estado}', [GestionarAulas::class, 'show']);
    Route::put('/{id}', [GestionarAulas::class, 'update']);
    Route::delete('/{id}', [GestionarAulas::class, 'destroy']);
});
Route::prefix('materia_grupo')->group(function () {
    // Crear materia
    Route::post('/materia', [GestionarMateriaGrupoController::class, 'crearMateria']);
    //ver materas
    Route::get('/materias', [GestionarMateriaGrupoController::class, 'listarMaterias']);
    // ver materias con grupos
    Route::get('/materia', [GestionarMateriaGrupoController::class, 'verMaterias']);
    // Editar materia
    Route::put('/materia/{id}', [GestionarMateriaGrupoController::class, 'editarMateria']);
    // Eliminar materia
    Route::delete('/materia/{id}', [GestionarMateriaGrupoController::class, 'eliminarMateria']);
    // Crear grupo y asignarlo a materia
    Route::post('/materia/{materia_id}/grupo', [GestionarMateriaGrupoController::class, 'asignarGrupo']);
    // ver grupos
    Route::get('/grupo', [GestionarMateriaGrupoController::class, 'verGrupos']);
    // Editar grupo
    Route::put('/grupo/{id}', [GestionarMateriaGrupoController::class, 'editarGrupo']);
    // Eliminar grupo
    Route::delete('/grupo/{id}', [GestionarMateriaGrupoController::class, 'eliminarGrupo']);
    // Desasignar grupo de materia
    Route::delete('/materia/{materia_id}/grupo/{grupo_id}', [GestionarMateriaGrupoController::class, 'desasignarGrupo']);
    Route::get('/vinculados', [GestionarMateriaGrupoController::class, 'verMateriasConGrupos']);
    //Asignar materia a profesor
    Route::post('/asignar_materia_profesor', [GestionarMateriaGrupoController::class, 'asignarMateriaAProfesor']);
});

// Rutas API de gestionar horarios
Route::prefix('horario')->group(function () {
    
    Route::post('/', [HorarioController::class, 'asignarHorario']); // CU06 + CU07: Asignar horario a clase
    Route::get('/', [HorarioController::class, 'index']); // Listar todos los horarios
    Route::get('/profesor/{ci}', [HorarioController::class, 'porProfesor']); // Listar horarios con nombres de profesores
    Route::get('/docente/{ci}', [HorarioController::class, 'porDocente']); // Ver horarios por docente
    Route::get('/grupo/{grupo_id}', [HorarioController::class, 'porGrupo']); // Ver horarios por grupo
    Route::get('/aula/{aula_id}', [HorarioController::class, 'porAula']); // Ver horarios por aula
    Route::put('/{id}', [HorarioController::class, 'update']); // Editar horario
    Route::delete('/{id}', [HorarioController::class, 'destroy']); // Eliminar horario
});

//ruta de api clase
Route::get('/clases', [ClaseController::class, 'aula_docente']);
Route::post('/clases', [ClaseController::class, 'store']);
Route::get('/clases/profesor-materia-grupo', [ClaseController::class, 'listarRelacionesPMG']);
//ruta para importar usuarios
Route::post('/importar-usuarios', [ImportarUsuarioController::class, 'importar']);


//rutas para administrar usuarios
Route::prefix('administrar_usuario')->group(function () {
    Route::post('/asignar_rol', [AdministrarUsuario::class, 'asignarRol']);
    Route::post('/crear_rol', [AdministrarUsuario::class, 'crearRol']);
    Route::get('/listar_usuarios', [AdministrarUsuario::class, 'listarUsuarios']);
    Route::get('/listar_roles', [AdministrarUsuario::class, 'listarRoles']);
});
// Ruta de prueba de conexión a la base de datos
Route::get('/test-db', function () {
    return \DB::select('SELECT 1 AS test');
});
