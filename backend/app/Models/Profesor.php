<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profesor extends Model
{
    protected $table = 'profesor'; // ← nombre real de tu tabla en PostgreSQL

    protected $primaryKey = 'ci'; // ← clave primaria personalizada
    public $incrementing = false; // ← porque CI no es autoincremental
    protected $keyType = 'integer'; // ← corregido: no es 'interger', debe ser 'string'

    protected $fillable = ['ci', 'nombre', 'telefono'];
}
