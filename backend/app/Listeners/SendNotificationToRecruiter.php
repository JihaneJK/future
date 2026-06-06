<?php

namespace App\Listeners;

use App\Events\ApplicationSubmitted;
use App\Models\Notification;
use Illuminate\Support\Facades\Log;

class SendNotificationToRecruiter
{
    public function handle(ApplicationSubmitted $event)
    {
        $application = $event->application;
        $job = $application->job;

        if (!$job) {
            Log::warning('ApplicationSubmitted: job introuvable');
            return;
        }

        try {
            Notification::create([
                'user_id' => $job->user_id,
                'type'    => 'application',
                'data'    => [
                    'application_id' => $application->id,
                    'job_id'         => $job->id,
                    'job_title'      => $job->title,
                    'student_name'   => $application->user->first_name . ' ' . $application->user->last_name,
                    'student_id'     => $application->user_id,
                ],
            ]);
        } catch (\Exception $e) {
            Log::warning('Échec notification candidature: ' . $e->getMessage());
        }
    }
}
