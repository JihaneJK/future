<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('schools', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('city');
            $table->enum('type', ['Public', 'Privé']);
            $table->enum('level', ['bac2', 'bac3', 'bac5', 'prepa']);
            $table->integer('rating')->default(0);
            $table->string('tuition');
            $table->string('duration');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->json('programs')->nullable();
            $table->string('website')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('schools');
    }
};