<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    //  Iniciar sesión
    public function login(Request $request)
    {
        // Buscar usuario por código
        $usuario = DB::table('usuario')->where('codigo', $request->codigo)->first();

        // Verificar si existe y si la contraseña es correcta
        if ($usuario && Hash::check($request->password, $usuario->password)) {
            // Guardar el ID del usuario en la sesión
            session(['usuario_id' => $usuario->id]);

            // Devolver datos del usuario
            return response()->json(['success' => true, 'usuario' => $usuario]);
        }

        // Si las credenciales no coinciden, devolver error 401
        return response()->json(['error' => 'Credenciales inválidas'], 401);
    }

    //  Cerrar sesión
    public function logout()
    {
        // Eliminar todos los datos de sesión
        session()->flush();

        // Confirmar cierre de sesión
        return response()->json(['success' => true, 'message' => 'Sesión cerrada correctamente']);
    }

    //  Registrar nuevo usuario
    public function register(Request $request)
    {
        try {
            // Validar los datos recibidos
            $request->validate([
                'username' => 'required',                          // nombre de usuario obligatorio
                'password' => 'required|min:6',                    // contraseña mínima de 6 caracteres
                'codigo' => 'required|integer|unique:usuario'      // código único y obligatorio
            ]);

            // Insertar usuario en la base de datos con contraseña encriptada
            $id = DB::table('usuario')->insertGetId([
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'codigo' => $request->codigo
            ]);

            // Devolver ID del nuevo usuario
            return response()->json(['success' => true, 'usuario_id' => $id]);
        } catch (\Exception $e) {
            // Capturar errores internos y devolver mensaje
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
