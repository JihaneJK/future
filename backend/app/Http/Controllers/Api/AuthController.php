<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $data = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name'  => 'required|string|max:255',
                'email'      => 'required|email|unique:users',
                'password'   => 'required|min:8',
                'role'       => 'sometimes|in:student,recruiter,admin',
                'phone'      => 'nullable|string|max:20',
                'city'       => 'nullable|string|max:255',
                'company'    => 'nullable|string|max:255',
            ]);

            $user = User::create([
                'first_name' => $data['first_name'],
                'last_name'  => $data['last_name'],
                'email'      => $data['email'],
                'password'   => Hash::make($data['password']),
                'role'       => $data['role'] ?? 'student',
                'phone'      => $data['phone'] ?? null,
                'city'       => $data['city'] ?? null,
                'company'    => $data['company'] ?? null,
            ]);

            $token = $user->createToken('auth')->plainTextToken;

            return response()->json([
                'success' => true,
                'user' => [
                    'id'         => $user->id,
                    'first_name' => $user->first_name,
                    'last_name'  => $user->last_name,
                    'email'      => $user->email,
                    'role'       => $user->role,
                    'phone'      => $user->phone,
                    'city'       => $user->city,
                    'company'    => $user->company,
                ],
                'token' => $token
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('Register error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $data = $request->validate([
                'email'    => 'required|email',
                'password' => 'required',
            ]);

            $user = User::where('email', $data['email'])->first();

            if (!$user || !Hash::check($data['password'], $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email ou mot de passe incorrect'
                ], 401);
            }

            $token = $user->createToken('auth')->plainTextToken;

            return response()->json([
                'success' => true,
                'user' => [
                    'id'         => $user->id,
                    'first_name' => $user->first_name,
                    'last_name'  => $user->last_name,
                    'email'      => $user->email,
                    'role'       => $user->role,
                    'phone'      => $user->phone,
                    'city'       => $user->city,
                    'company'    => $user->company,
                ],
                'token' => $token
            ]);
            
        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnexion réussie']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}