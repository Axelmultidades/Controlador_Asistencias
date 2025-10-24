<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('materia_grupos', function (Blueprint $table) {
            
            $table->foreignId('materia_id')->constrained('materia')->onDelete('cascade');
            $table->foreignId('grupo_id')->constrained('grupo')->onDelete('cascade');
            $table->primary(['materia_id', 'grupo_id']); // clave compuesta
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materia_grupos');
    }
};
