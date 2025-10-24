<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    public function login(Request $request)
    {
        $usuario = DB::table('usuario')->where('codigo', $request->codigo)->first();

        if ($usuario && Hash::check($request->password, $usuario->password)) {
            session(['usuario_id' => $usuario->id]);
            return response()->json(['success' => true, 'usuario' => $usuario]);
        }

        return response()->json(['error' => 'Credenciales inválidas'], 401);
    }
    public function logout()
    {
        session()->flush(); // Elimina todos los datos de sesión
        return response()->json(['success' => true, 'message' => 'Sesión cerrada correctamente']);
    }
    
  public function register(Request $request)
    {
    try {
        $request->validate([
            'username' => 'required',
            'password' => 'required|min:6',
            'codigo' => 'required|integer|unique:usuario'
        ]);

        $id = DB::table('usuario')->insertGetId([
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'codigo' => $request->codigo
        ]);

        return response()->json(['success' => true, 'usuario_id' => $id]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
    }



}
