<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\School;
use Illuminate\Http\Request;

class SchoolController extends Controller
{
    public function index(Request $request)
    {
        $schools = School::where('active', true)
            ->orderBy('rating', 'desc')
            ->get();

        return response()->json($schools);
    }

    public function show($id)
    {
        $school = School::findOrFail($id);
        return response()->json($school);
    }
}