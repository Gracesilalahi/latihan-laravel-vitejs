<?php
<<<<<<< HEAD
=======

>>>>>>> a1cf726625f93df4809ee9667c0ea33efe338ec0
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
<<<<<<< HEAD
        // DIBIARKAN KOSONG untuk melewati duplikasi kolom.
=======
        Schema::table('todos', function (Blueprint $table) {
            if (!Schema::hasColumn('todos', 'status')) {
                $table->string('status')->default('pending');
            }
        });
>>>>>>> a1cf726625f93df4809ee9667c0ea33efe338ec0
    }

    public function down(): void
    {
<<<<<<< HEAD
        // DIBIARKAN KOSONG
    }
};
=======
        Schema::table('todos', function (Blueprint $table) {
            if (Schema::hasColumn('todos', 'status')) {
                $table->dropColumn('status');
            }
        });
    }
};
>>>>>>> a1cf726625f93df4809ee9667c0ea33efe338ec0
