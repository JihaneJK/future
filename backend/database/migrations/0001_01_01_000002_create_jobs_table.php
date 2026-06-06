<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('company');
            $table->string('city');
            $table->enum('type', ['CDI', 'CDD', 'Stage', 'Alternance']);
            $table->string('salary');
            $table->text('description')->nullable();
            $table->json('skills')->nullable();
            $table->integer('views')->default(0);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('jobs');
    }
};