<?php

namespace App\Http\Controllers;

use App\Events\TestMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BroadcastController extends Controller
{
    /**
     * Display the broadcasting test page.
     */
    public function index()
    {
        return Inertia::render('broadcast');
    }

    /**
     * Broadcast a test message.
     */
    public function broadcast(Request $request)
    {
        $message = $request->input('message', 'Hello from Laravel Reverb!');
        
        // Log the message for debugging
        \Log::info('Broadcasting message: ' . $message);
        
        // Broadcast the event
        event(new TestMessage($message));
        
        return response()->json(['success' => true, 'message' => $message]);
    }
}
