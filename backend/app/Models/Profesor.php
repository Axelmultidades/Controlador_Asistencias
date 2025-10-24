<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profesor extends Model
{
    protected $table = 'profesor'; // nombre real de la tabla
    protected $primaryKey = 'ci'; // clave primaria personalizada
    public $incrementing = false; // porque CI no es autoincremental
    protected $keyType = 'integer'; // tipo de dato correcto

    protected $fillable = ['ci', 'nombre', 'telefono'];
}


