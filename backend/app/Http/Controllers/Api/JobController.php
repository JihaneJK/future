<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\Request;

class JobController extends Controller
{
    public function index()
    {
        $jobs = Job::where('active', true)
            ->with('user:id,first_name,last_name,company')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($jobs);
    }

    public function show($id)
    {
        $job = Job::with('user:id,first_name,last_name,company')->findOrFail($id);
        $job->increment('views');
        return response()->json($job);
    }

    public function myJobs(Request $request)
    {
        $jobs = $request->user()->jobs()->get();
        return response()->json($jobs);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string',
            'city'        => 'required|string',
            'type'        => 'required|in:CDI,CDD,Stage,Alternance',
            'salary'      => 'required|string',
            'description' => 'required|string',
            'skills'      => 'nullable|string',
        ]);

        $data['company'] = $request->input('company') ?: ($request->user()->company ?? '');
        $data['active'] = true;

        $job = $request->user()->jobs()->create($data);
        return response()->json(['success' => true, 'job' => $job], 201);
    }

    public function destroy(Request $request, $id)
    {
        $job = Job::findOrFail($id);
        $job->delete();
        return response()->json(['message' => 'Offre supprimée']);
    }
}