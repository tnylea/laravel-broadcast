import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Enable Pusher logging for debugging
Pusher.logToConsole = true;
window.Pusher = Pusher;

console.log('Echo config:', {
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    wssPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: false,
});

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    wssPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
});

// Debug Echo connection
window.Echo.connector.pusher.connection.bind('connected', () => {
    console.log('Echo connected successfully!');
});

window.Echo.connector.pusher.connection.bind('error', (error) => {
    console.error('Echo connection error:', error);
});

// Debug all events received
window.Echo.connector.pusher.connection.bind('message', (message) => {
    console.log('Pusher message received:', message);
    // Log the message data in more detail
    if (message && message.data) {
        try {
            const data = JSON.parse(message.data);
            console.log('Parsed message data:', data);

            // Check if this is an event message
            if (data.event) {
                console.log('Event type:', data.event);
                console.log('Event channel:', data.channel);

                if (data.data) {
                    try {
                        const eventData = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
                        console.log('Event data:', eventData);
                    } catch (e) {
                        console.log('Raw event data:', data.data);
                    }
                }
            }
        } catch (e) {
            console.log('Raw message data:', message.data);
        }
    }
});

// Log all channel subscriptions
window.Echo.connector.pusher.channels.all().forEach(channel => {
    console.log('Currently subscribed to channel:', channel.name);
});

// Add global debugging for all Echo events
window.Echo.connector.pusher.global_emitter.bind('message', (message) => {
    console.log('Global message received:', message);
});