<?php

// app/Models/Usuario.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    protected $table = 'usuarios';

    protected $fillable = ['username', 'contraseña'];

    protected $hidden = ['contraseña'];

    public $timestamps = true;
}
