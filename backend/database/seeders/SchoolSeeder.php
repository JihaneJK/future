<?php

namespace Database\Seeders;

use App\Models\School;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SchoolSeeder extends Seeder
{
    public function run(): void
    {
        $schools = [
            ['id' => 1,  'name' => 'ENSA Fès',              'city' => 'Fès',        'type' => 'Public', 'level' => 'bac2', 'rating' => 92, 'tuition' => '2500 DH', 'duration' => '2 ans', 'slug' => 'ensa-fes',          'description' => 'École Nationale des Sciences Appliquées',       'active' => true],
            ['id' => 2,  'name' => 'ENSA Tanger',            'city' => 'Tanger',     'type' => 'Public', 'level' => 'bac2', 'rating' => 88, 'tuition' => '2500 DH', 'duration' => '2 ans', 'slug' => 'ensa-tanger',       'description' => 'École Nationale des Sciences Appliquées',       'active' => true],
            ['id' => 3,  'name' => 'ENSA Marrakech',         'city' => 'Marrakech',  'type' => 'Public', 'level' => 'bac2', 'rating' => 85, 'tuition' => '2500 DH', 'duration' => '2 ans', 'slug' => 'ensa-marrakech',    'description' => 'École Nationale des Sciences Appliquées',       'active' => true],
            ['id' => 4,  'name' => 'ENSA Oujda',             'city' => 'Oujda',      'type' => 'Public', 'level' => 'bac2', 'rating' => 82, 'tuition' => '2500 DH', 'duration' => '2 ans', 'slug' => 'ensa-oujda',        'description' => 'École Nationale des Sciences Appliquées',       'active' => true],
            ['id' => 5,  'name' => 'ENSA Kénitra',           'city' => 'Kénitra',    'type' => 'Public', 'level' => 'bac2', 'rating' => 80, 'tuition' => '2500 DH', 'duration' => '2 ans', 'slug' => 'ensa-kenitra',      'description' => 'École Nationale des Sciences Appliquées',       'active' => true],
            ['id' => 6,  'name' => 'ENSA Safi',              'city' => 'Safi',       'type' => 'Public', 'level' => 'bac2', 'rating' => 78, 'tuition' => '2500 DH', 'duration' => '2 ans', 'slug' => 'ensa-safi',         'description' => 'École Nationale des Sciences Appliquées',       'active' => true],
            ['id' => 7,  'name' => 'ENCG Casablanca',        'city' => 'Casablanca', 'type' => 'Public', 'level' => 'bac2', 'rating' => 89, 'tuition' => '3500 DH', 'duration' => '2 ans', 'slug' => 'encg-casablanca',   'description' => 'École Nationale de Commerce et Gestion',        'active' => true],
            ['id' => 8,  'name' => 'ENCG Rabat',             'city' => 'Rabat',      'type' => 'Public', 'level' => 'bac2', 'rating' => 87, 'tuition' => '3000 DH', 'duration' => '2 ans', 'slug' => 'encg-rabat',        'description' => 'École Nationale de Commerce et Gestion',        'active' => true],
            ['id' => 9,  'name' => 'ENCG Tanger',            'city' => 'Tanger',     'type' => 'Public', 'level' => 'bac2', 'rating' => 85, 'tuition' => '3000 DH', 'duration' => '2 ans', 'slug' => 'encg-tanger',       'description' => 'École Nationale de Commerce et Gestion',        'active' => true],
            ['id' => 10, 'name' => 'ENCG Marrakech',         'city' => 'Marrakech',  'type' => 'Public', 'level' => 'bac2', 'rating' => 84, 'tuition' => '3000 DH', 'duration' => '2 ans', 'slug' => 'encg-marrakech',    'description' => 'École Nationale de Commerce et Gestion',        'active' => true],
            ['id' => 11, 'name' => 'ENCG Fès',               'city' => 'Fès',        'type' => 'Public', 'level' => 'bac2', 'rating' => 83, 'tuition' => '2800 DH', 'duration' => '2 ans', 'slug' => 'encg-fes',          'description' => 'École Nationale de Commerce et Gestion',        'active' => true],
            ['id' => 12, 'name' => 'ENCG Settat',            'city' => 'Settat',     'type' => 'Public', 'level' => 'bac2', 'rating' => 79, 'tuition' => '2800 DH', 'duration' => '2 ans', 'slug' => 'encg-settat',       'description' => 'École Nationale de Commerce et Gestion',        'active' => true],
            ['id' => 13, 'name' => 'EST Salé',               'city' => 'Salé',       'type' => 'Public', 'level' => 'bac2', 'rating' => 78, 'tuition' => '2000 DH', 'duration' => '2 ans', 'slug' => 'est-sale',          'description' => 'École Supérieure de Technologie',               'active' => true],
            ['id' => 14, 'name' => 'EST Meknès',             'city' => 'Meknès',     'type' => 'Public', 'level' => 'bac2', 'rating' => 76, 'tuition' => '2000 DH', 'duration' => '2 ans', 'slug' => 'est-meknes',        'description' => 'École Supérieure de Technologie',               'active' => true],
            ['id' => 15, 'name' => 'EST Béni Mellal',        'city' => 'Béni Mellal','type' => 'Public', 'level' => 'bac2', 'rating' => 74, 'tuition' => '2000 DH', 'duration' => '2 ans', 'slug' => 'est-benimellal',    'description' => 'École Supérieure de Technologie',               'active' => true],
            ['id' => 16, 'name' => 'ISITIC',                 'city' => 'Rabat',      'type' => 'Privé',  'level' => 'bac2', 'rating' => 85, 'tuition' => '2800 DH', 'duration' => '2 ans', 'slug' => 'isitic',           'description' => 'Institut Supérieur de Technologie',             'active' => true],
            ['id' => 17, 'name' => 'ISMA',                   'city' => 'Casablanca', 'type' => 'Privé',  'level' => 'bac2', 'rating' => 80, 'tuition' => '2500 DH', 'duration' => '2 ans', 'slug' => 'isma',             'description' => 'Institut Supérieur',                            'active' => true],
            ['id' => 18, 'name' => 'INSEA',                  'city' => 'Rabat',      'type' => 'Public', 'level' => 'bac3', 'rating' => 90, 'tuition' => '2000 DH', 'duration' => '3 ans', 'slug' => 'insea',            'description' => 'Institut National de Statistique',              'active' => true],
            ['id' => 19, 'name' => 'ENSIAS',                 'city' => 'Rabat',      'type' => 'Public', 'level' => 'bac3', 'rating' => 92, 'tuition' => '2500 DH', 'duration' => '3 ans', 'slug' => 'ensias',           'description' => 'École Nationale Supérieure',                    'active' => true],
            ['id' => 20, 'name' => 'ISIT',                   'city' => 'Rabat',      'type' => 'Public', 'level' => 'bac3', 'rating' => 86, 'tuition' => '2500 DH', 'duration' => '3 ans', 'slug' => 'isit',             'description' => 'Institut Supérieur',                            'active' => true],
            ['id' => 21, 'name' => 'INPT',                   'city' => 'Rabat',      'type' => 'Public', 'level' => 'bac3', 'rating' => 88, 'tuition' => '2500 DH', 'duration' => '3 ans', 'slug' => 'inpt',             'description' => 'Institut National des Postes',                  'active' => true],
            ['id' => 22, 'name' => 'HEM',                    'city' => 'Casablanca', 'type' => 'Privé',  'level' => 'bac3', 'rating' => 88, 'tuition' => '4500 DH', 'duration' => '3 ans', 'slug' => 'hem',              'description' => 'Institut des Hautes Études',                     'active' => true],
            ['id' => 23, 'name' => 'ESCA',                   'city' => 'Casablanca', 'type' => 'Privé',  'level' => 'bac3', 'rating' => 86, 'tuition' => '4200 DH', 'duration' => '3 ans', 'slug' => 'esca',             'description' => 'École Supérieure de Commerce',                  'active' => true],
            ['id' => 24, 'name' => 'ISCAE',                  'city' => 'Casablanca', 'type' => 'Privé',  'level' => 'bac3', 'rating' => 84, 'tuition' => '4000 DH', 'duration' => '3 ans', 'slug' => 'iscae',            'description' => 'Institut Supérieur de Commerce',                'active' => true],
            ['id' => 25, 'name' => 'EMI',                    'city' => 'Rabat',      'type' => 'Public', 'level' => 'bac5', 'rating' => 95, 'tuition' => '1500 DH', 'duration' => '5 ans', 'slug' => 'emi',              'description' => 'École Mohammadia Ingénieurs',                   'active' => true],
            ['id' => 26, 'name' => 'ENSAM',                  'city' => 'Meknès',     'type' => 'Public', 'level' => 'bac5', 'rating' => 90, 'tuition' => '1000 DH', 'duration' => '5 ans', 'slug' => 'ensam',            'description' => 'Arts et Métiers',                               'active' => true],
            ['id' => 27, 'name' => 'Ecole Normale Supérieure','city' => 'Fès',       'type' => 'Public', 'level' => 'bac5', 'rating' => 92, 'tuition' => '1000 DH', 'duration' => '5 ans', 'slug' => 'ens-fes',          'description' => 'ENS Fès',                                      'active' => true],
            ['id' => 28, 'name' => 'Prépa ENSAM Fès',        'city' => 'Fès',        'type' => 'Public', 'level' => 'prepa', 'rating' => 90, 'tuition' => '1000 DH', 'duration' => '2 ans', 'slug' => 'prepa-ensam-fes',  'description' => 'Classes Préparatoires',                         'active' => true],
            ['id' => 29, 'name' => 'Prépa ENSAM Meknès',     'city' => 'Meknès',     'type' => 'Public', 'level' => 'prepa', 'rating' => 87, 'tuition' => '1000 DH', 'duration' => '2 ans', 'slug' => 'prepa-ensam-meknes','description' => 'Classes Préparatoires',                         'active' => true],
            ['id' => 30, 'name' => 'Prépa Louis',            'city' => 'Casablanca', 'type' => 'Public', 'level' => 'prepa', 'rating' => 85, 'tuition' => '1000 DH', 'duration' => '2 ans', 'slug' => 'prepa-louis',      'description' => 'CPGE',                                         'active' => true],
        ];

        DB::statement('SET FOREIGN_KEY_CHECKS = 0');
        School::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS = 1');
        DB::statement("SET SESSION sql_mode = ''");

        foreach ($schools as $school) {
            $s = new School();
            $s->id = $school['id'];
            $s->name = $school['name'];
            $s->city = $school['city'];
            $s->type = $school['type'];
            $s->level = $school['level'];
            $s->rating = $school['rating'];
            $s->tuition = $school['tuition'];
            $s->duration = $school['duration'];
            $s->slug = $school['slug'];
            $s->description = $school['description'];
            $s->active = $school['active'];
            $s->save();
        }
    }
}
