<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\School;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ApplicationController extends Controller
{
    public function storeSchool(Request $request, $id)
    {
        if ($request->user()->role !== 'student') {
            return response()->json(['error' => 'Seuls les étudiants peuvent postuler'], 403);
        }

        $school = School::find($id);
        if (!$school) {
            return response()->json(['error' => 'École introuvable'], 404);
        }

        $exists = Application::where('user_id', $request->user()->id)
            ->where('school_id', $school->id)
            ->exists();

        if ($exists) {
            return response()->json(['error' => 'Déjà postulé'], 409);
        }

        $application = Application::create([
            'school_id' => $school->id,
            'user_id'   => $request->user()->id,
            'status'    => 'pending',
        ]);

        try {
            $admins = User::where('role', 'admin')->get();
            foreach ($admins as $admin) {
                Notification::create([
                    'user_id' => $admin->id,
                    'type'    => 'school_application',
                    'data'    => [
                        'application_id' => $application->id,
                        'school_id'      => $school->id,
                        'school_name'    => $school->name,
                        'student_name'   => $request->user()->first_name . ' ' . $request->user()->last_name,
                        'student_id'     => $request->user()->id,
                    ],
                ]);
            }
        } catch (\Exception $e) {
            Log::warning('Échec notification candidature école: ' . $e->getMessage());
        }

        return response()->json(['success' => true, 'message' => 'Candidature envoyée'], 200);
    }
}
