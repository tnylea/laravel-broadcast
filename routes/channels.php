<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Test public channel - no authentication required
Broadcast::channel('test-channel', function () {
    return true;
});
