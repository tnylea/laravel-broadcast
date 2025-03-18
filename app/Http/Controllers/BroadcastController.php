<?php

namespace App\Http\Controllers;

use App\Events\TestMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BroadcastController extends Controller
{
    /**
     * Broadcast a test message.
     */
    public function broadcast(Request $request)
    {
        $message = $request->input('message', 'Hello from Laravel Reverb!');
        
        // Broadcast the event
        event(new TestMessage($message));
        
        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'message' => $message]);
        }
        
        // Return to the same page with a success flash message
        return back()->with('success', 'Message sent successfully');
    }
}
