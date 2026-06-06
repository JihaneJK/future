<?php

namespace App\Events;

use App\Models\Application;
use Illuminate\Queue\SerializesModels;

class ApplicationSubmitted
{
    use SerializesModels;

    public $application;

    public function __construct(Application $application)
    {
        $this->application = $application;
    }
}
