<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class AdministrarUsuario extends Controller
{
    //asignar roles a los usuarios
    function asignarRol(Request $request)
{
    $request->validate([
        'user_id' => 'required|integer|exists:usuario,id',
        'rol' => 'required|string|exists:rol,nombre',
    ]);

    $role = DB::table('rol')->where('nombre', $request->rol)->first();

    if (!$role) {
        return response()->json([
            'success' => false,
            'message' => 'El rol especificado no existe'
        ], 404);
    }

    $existe = DB::table('usuario_rol')
        ->where('id_usuario', $request->user_id)
        ->where('id_rol', $role->id)
        ->exists();

    if ($existe) {
        return response()->json([
            'success' => false,
            'message' => 'El usuario ya tiene este rol asignado'
        ], 409);
    }

    DB::table('usuario_rol')->insert([
        'id_usuario' => $request->user_id,
        'id_rol' => $role->id,
    ]);

    $user = DB::table('usuario')->where('id', $request->user_id)->first();
    $roles = DB::table('usuario_rol')
        ->join('rol', 'usuario_rol.id_rol', '=', 'rol.id')
        ->where('usuario_rol.id_usuario', $request->user_id)
        ->pluck('rol.nombre');

    return response()->json([
        'success' => true,
        'message' => 'Rol asignado correctamente al usuario',
        'user' => $user,
        'roles' => $roles
    ]);
}

    //crear rol
    function crearRol(Request $request){
    $request->validate([
        'nombre' => 'required|string|unique:rol,nombre',
    ]);
        $role = DB::table('rol')->insertGetId([
            'nombre' => $request->nombre,
        ]);
        return response()->json([
            'success' => true,
            'message' => 'Rol creado correctamente',
            'role_id' => $role
        ]);
    }

    //editar rol
    function editarRol(Request $request, $id){
    $request->validate([
        'nombre' => 'required|string|unique:rol,nombre,'.$id,
    ]);
        DB::table('rol')->where('id', $id)->update([
            'nombre' => $request->nombre,
        ]);
        return response()->json([
            'success' => true,
            'message' => 'Rol editado correctamente',
        ]);
    }

    //eliminar rol
    public function eliminarRol($id)
{
    // Eliminar todas las asignaciones del rol
    DB::table('usuario_rol')->where('id_rol', $id)->delete();

    // Eliminar el rol en sí
    DB::table('rol')->where('id', $id)->delete();

    return response()->json([
        'success' => true,
        'message' => 'Rol y sus asignaciones eliminados correctamente',
    ]);
}


    //editar rol de usuario
    function editarRolUsuario(Request $request){
    $request->validate([
        'user_id' => 'required|integer|exists:usuario,id',
        'rol' => 'required|string|exists:rol,nombre',
    ]);
    $role = DB::table('rol')->where('nombre', $request->rol)->first();
    DB::table('usuario_rol')->where('id_usuario', $request->user_id)->update([
        'id_rol' => $role->id,
    ]);
    return response()->json([
        'success' => true,
        'message' => 'Rol de usuario editado correctamente',
    ]);
    }
    //eliminar rol de usuario
    function eliminarRolUsuario(Request $request){
    $request->validate([
        'user_id' => 'required|integer|exists:usuario,id',
        'rol' => 'required|string|exists:rol,nombre',
    ]);
    $role = DB::table('rol')->where('nombre', $request->rol)->first();
    DB::table('usuario_rol')->where('id_usuario', $request->user_id)->where('id_rol', $role->id)->delete();
    return response()->json([
        'success' => true,
        'message' => 'Rol de usuario eliminado correctamente',
    ]);
    }

    //listar roles
    function listarRoles()
{
    $roles = DB::table('rol')->select('id', 'nombre')->get();

    return response()->json($roles);
}
    //listar usuarios
public function listarUsuarios()
{
    return DB::table('usuario')->select('id', 'username','codigo')->get();
}

}
