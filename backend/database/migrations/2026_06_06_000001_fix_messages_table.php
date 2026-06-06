<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Colonnes déjà gérées par les accesseurs/mutateurs dans Message.php
        // La table messages utilise déjà `content` (TEXT) et `read` (BOOLEAN)
    }

    public function down()
    {
    }
};
