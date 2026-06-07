<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\SchoolController;
use App\Http\Controllers\Api\ApplicationController;
use App\Models\User;
use App\Models\Job;
use App\Models\Message;
use App\Models\Application;
use App\Models\Notification;
use App\Models\School;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{id}', [JobController::class, 'show']);
Route::get('/schools', [SchoolController::class, 'index']);
Route::get('/schools/{slugOrId}', [SchoolController::class, 'show']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::put('/me', function (Request $request) {
        $data = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name'  => 'sometimes|string|max:255',
            'phone'      => 'nullable|string|max:20',
            'city'       => 'nullable|string|max:255',
            'company'    => 'nullable|string|max:255',
            'bio'        => 'nullable|string',
        ]);
        $user = $request->user();
        $user->update($data);
        return response()->json(['success' => true, 'user' => $user]);
    });

    // Jobs (recruiter-owned)
    Route::get('/my-jobs', function (Request $request) {
        return $request->user()->jobs()->orderBy('created_at', 'desc')->get();
    });

    Route::post('/jobs', [JobController::class, 'store']);

    Route::put('/jobs/{id}', function (Request $request, $id) {
        $job = Job::findOrFail($id);
        if ($request->user()->id !== $job->user_id && $request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Action non autorisée'], 403);
        }
        $data = $request->validate([
            'title'       => 'sometimes|string',
            'company'     => 'sometimes|string',
            'city'        => 'sometimes|string',
            'type'        => 'sometimes|in:CDI,CDD,Stage,Alternance',
            'salary'      => 'sometimes|string',
            'description' => 'sometimes|string',
            'skills'      => 'nullable|string',
            'active'      => 'sometimes|boolean',
        ]);
        $job->update($data);
        return response()->json($job);
    });

    Route::delete('/jobs/{id}', function (Request $request, $id) {
        $job = Job::findOrFail($id);
        if ($request->user()->id !== $job->user_id && $request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Action non autorisée'], 403);
        }
        $job->delete();
        return response()->json(['message' => 'Offre supprimée']);
    });

    // Applications / Candidatures
    Route::get('/jobs/{id}/applications', function (Request $request, $id) {
        $job = Job::findOrFail($id);
        if ($request->user()->id !== $job->user_id && $request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Action non autorisée'], 403);
        }
        return Application::where('job_id', $job->id)
            ->with('user:id,first_name,last_name,email')
            ->orderBy('created_at', 'desc')
            ->get();
    });

    Route::post('/jobs/{id}/apply', function (Request $request, $id) {
        if ($request->user()->role !== 'student') {
            return response()->json(['success' => false, 'message' => 'Seuls les étudiants peuvent postuler'], 403);
        }
        $job = Job::findOrFail($id);
        $existing = Application::where('job_id', $job->id)
            ->where('user_id', $request->user()->id)
            ->first();
        if ($existing) {
            return response()->json(['success' => false, 'message' => 'Vous avez déjà postulé'], 409);
        }
        $application = Application::create([
            'job_id'  => $job->id,
            'user_id' => $request->user()->id,
            'status'  => 'pending',
        ]);

        // Notifier le recruteur
        try {
            Notification::create([
                'user_id' => $job->user_id,
                'type'    => 'application',
                'data'    => [
                    'application_id' => $application->id,
                    'job_id'         => $job->id,
                    'job_title'      => $job->title,
                    'student_name'   => $request->user()->first_name . ' ' . $request->user()->last_name,
                    'student_id'     => $request->user()->id,
                ],
            ]);
        } catch (\Exception $e) {
            Log::warning('Échec notification candidature: ' . $e->getMessage());
        }

        return response()->json(['success' => true, 'application' => $application], 201);
    });

    // Postuler à une école
    Route::post('/schools/{id}/apply', [ApplicationController::class, 'storeSchool']);

    // Mettre à jour le statut d'une candidature
    Route::put('/applications/{id}/status', function (Request $request, $id) {
        $data = $request->validate([
            'status' => 'required|in:accepted,rejected',
        ]);
        $application = Application::findOrFail($id);
        $job = $application->job;

        if ($request->user()->id !== $job->user_id && $request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Action non autorisée'], 403);
        }

        $application->update(['status' => $data['status']]);

        // Notifier l'étudiant
        try {
            Notification::create([
                'user_id' => $application->user_id,
                'type'    => 'application_' . $data['status'],
                'data'    => [
                    'application_id' => $application->id,
                    'job_id'         => $job->id,
                    'job_title'      => $job->title,
                    'status'         => $data['status'],
                ],
            ]);
        } catch (\Exception $e) {
            Log::warning('Échec création notification (status): ' . $e->getMessage());
        }

        return response()->json(['success' => true, 'application' => $application]);
    });

    // Récupérer toutes mes candidatures (pour étudiant)
    Route::get('/my-applications', function (Request $request) {
        return $request->user()->applications()
            ->with('job:id,title,company,city,type')
            ->orderBy('created_at', 'desc')
            ->get();
    });

    // Recruiters list
    Route::get('/recruiters', function () {
        return User::where('role', 'recruiter')
            ->select('id', 'first_name', 'last_name', 'email', 'company', 'city', 'phone')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id'         => $user->id,
                    'name'       => $user->first_name . ' ' . $user->last_name,
                    'first_name' => $user->first_name,
                    'last_name'  => $user->last_name,
                    'email'      => $user->email,
                    'company'    => $user->company,
                    'city'       => $user->city,
                    'phone'      => $user->phone,
                    'avatar'     => strtoupper(substr($user->first_name, 0, 1) . substr($user->last_name, 0, 1)),
                    'role'       => 'recruiter',
                    'jobs_count' => Job::where('user_id', $user->id)->count(),
                ];
            });
    });

    // Conversations
    Route::get('/conversations', function (Request $request) {
        $user = $request->user();
        try {
            $messages = Message::where('sender_id', $user->id)
                ->orWhere('receiver_id', $user->id)
                ->with(['sender:id,first_name,last_name', 'receiver:id,first_name,last_name'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->groupBy(fn($m) => $m->sender_id === $user->id ? $m->receiver_id : $m->sender_id);
        } catch (\Exception $e) {
            Log::error('Erreur conversations: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur base de données'], 500);
        }

        $conversations = [];
        foreach ($messages as $otherId => $msgs) {
            $other = $msgs->first()->sender_id === $user->id ? $msgs->first()->receiver : $msgs->first()->sender;
            $conversations[] = [
                'user' => [
                    'id'         => $other->id,
                    'name'       => $other->first_name . ' ' . $other->last_name,
                    'first_name' => $other->first_name,
                    'last_name'  => $other->last_name,
                    'avatar'     => strtoupper(substr($other->first_name, 0, 1) . substr($other->last_name, 0, 1)),
                ],
                'last_message' => $msgs->first()->message,
                'last_time'    => $msgs->first()->created_at,
                'unread'       => !$msgs->first()->read && $msgs->first()->receiver_id === $user->id,
                'messages'     => $msgs->sortBy('created_at')->values(),
            ];
        }
        Log::info('Conversations pour user ' . $user->id . ': ' . count($conversations) . ' conversations, messages total=' . ($messages->flatten()->count() ?? 0));
        return response()->json($conversations);
    });

    // Send a message
    Route::post('/messages', function (Request $request) {
        $data = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message'     => 'required|string|max:5000',
        ]);
        try {
            $message = Message::create([
                'sender_id'   => $request->user()->id,
                'receiver_id' => $data['receiver_id'],
                'message'     => $data['message'],
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur envoi message: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur base de données'], 500);
        }
        Log::info('Message créé: sender=' . $request->user()->id . ' receiver=' . $data['receiver_id'] . ' content=' . substr($data['message'], 0, 50));

        // Créer la notification pour le destinataire
        try {
            Notification::create([
                'user_id' => $data['receiver_id'],
                'type'    => 'message',
                'data'    => [
                    'message_id'  => $message->id,
                    'sender_id'   => $request->user()->id,
                    'sender_name' => $request->user()->first_name . ' ' . $request->user()->last_name,
                    'preview'     => mb_substr($data['message'], 0, 100),
                ],
            ]);
        } catch (\Exception $e) {
            Log::warning('Échec notification message: ' . $e->getMessage());
        }

        return response()->json($message, 201);
    });

    // Mark messages as read
    Route::put('/messages/{userId}/read', function (Request $request, $userId) {
        Message::where('sender_id', $userId)
            ->where('receiver_id', $request->user()->id)
            ->where('read', false)
            ->update(['read' => true]);
        return response()->json(['success' => true]);
    });

    // Notifications
    Route::get('/notifications', function (Request $request) {
        try {
            $notifications = $request->user()->notifications()
                ->orderBy('created_at', 'desc')
                ->get();
            return response()->json($notifications);
        } catch (\Exception $e) {
            Log::warning('Erreur notifications: ' . $e->getMessage());
            return response()->json([]);
        }
    });

    Route::get('/notifications/unread-count', function (Request $request) {
        try {
            $count = $request->user()->notifications()
                ->where('read', false)
                ->count();
            return response()->json(['count' => $count]);
        } catch (\Exception $e) {
            Log::warning('Erreur unread-count: ' . $e->getMessage());
            return response()->json(['count' => 0]);
        }
    });

    Route::put('/notifications/read-all', function (Request $request) {
        try {
            $request->user()->notifications()
                ->where('read', false)
                ->update(['read' => true]);
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::warning('Erreur read-all: ' . $e->getMessage());
            return response()->json(['success' => true]);
        }
    });

    Route::patch('/notifications/{id}/read', function (Request $request, $id) {
        try {
            $notif = Notification::where('id', $id)
                ->where('user_id', $request->user()->id)
                ->first();
            if ($notif) {
                $notif->update(['read' => true]);
            }
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::warning('Erreur mark-read: ' . $e->getMessage());
            return response()->json(['success' => true]);
        }
    });

    // Admin
    Route::prefix('admin')->group(function () {
        Route::get('/stats', function (Request $req) {
            if ($req->user()->role !== 'admin') {
                return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
            }
            return response()->json([
                'users'   => User::count(),
                'schools' => \App\Models\School::count(),
                'jobs'    => Job::count(),
            ]);
        });
        Route::get('/users', function (Request $req) {
            if ($req->user()->role !== 'admin') {
                return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
            }
            return User::select('id', 'first_name', 'last_name', 'email', 'role', 'created_at')->get();
        });
        Route::put('/users/{id}', function (Request $request, $id) {
            if ($request->user()->role !== 'admin') {
                return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
            }
            $data = $request->validate([
                'first_name' => 'sometimes|string|max:255',
                'last_name'  => 'sometimes|string|max:255',
                'email'      => 'sometimes|email|max:255|unique:users,email,' . $id,
                'role'       => 'sometimes|in:student,recruiter,admin',
            ]);
            $user = User::findOrFail($id);
            $user->update($data);
            return response()->json(['success' => true, 'user' => $user]);
        });
        Route::delete('/users/{id}', function (Request $request, $id) {
            if ($request->user()->role !== 'admin') {
                return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
            }
            User::findOrFail($id)->delete();
            return response()->json(['success' => true]);
        });
    });
});
