<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('soals', function (Blueprint $table) {
            $table->id();
            $table->string('matpel');
            $table->string('soal');
            $table->string('jwb1');
            $table->string('jwb2');
            $table->string('jwb3');
            $table->string('jwb4');
            $table->string('jawaban');
            $table->string('kelas');
            $table->string('guru');
            $table->string('kode_soal');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('soals');
    }
};
