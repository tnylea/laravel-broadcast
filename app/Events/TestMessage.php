<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TestMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    // Making the message public ensures it will be serialized and broadcast
    public $message;

    /**
     * Create a new event instance.
     */
    public function __construct(string $message)
    {
        $this->message = $message;
        \Log::info('TestMessage event constructed with message: ' . $message);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        \Log::info('TestMessage broadcastOn called, returning test-channel');
        return new Channel('test-channel');
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        \Log::info('TestMessage broadcastAs called, returning test.message');
        return 'test.message';
    }
    
    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        \Log::info('TestMessage broadcastWith called, returning message: ' . $this->message);
        return ['message' => $this->message];
    }
}
