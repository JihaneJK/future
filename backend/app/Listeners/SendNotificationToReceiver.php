<?php

namespace App\Listeners;

use App\Events\MessageSent;
use App\Models\Notification;
use Illuminate\Support\Facades\Log;

class SendNotificationToReceiver
{
    public function handle(MessageSent $event)
    {
        $message = $event->message;

        try {
            Notification::create([
                'user_id' => $message->receiver_id,
                'type'    => 'message',
                'data'    => [
                    'message_id'  => $message->id,
                    'sender_id'   => $message->sender_id,
                    'sender_name' => $message->sender->first_name . ' ' . $message->sender->last_name,
                    'preview'     => mb_substr($message->message, 0, 100),
                ],
            ]);
        } catch (\Exception $e) {
            Log::warning('Échec notification message: ' . $e->getMessage());
        }
    }
}
