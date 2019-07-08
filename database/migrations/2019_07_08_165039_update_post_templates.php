<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdatePostTemplates extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('post_templates', function (Blueprint $table) {
            $table->tinyInteger('global')->after('content')->comment('是否全局共享模版');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('post_templates', function (Blueprint $table) {
            $table->dropColumn('global');
        });
    }
}
