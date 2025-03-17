import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function BroadcastIndex() {
    const [message, setMessage] = useState('');
    const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
    const [status, setStatus] = useState('Disconnected');

    useEffect(() => {
        console.log('Setting up Echo channel subscription...');
        
        // Subscribe to the test channel
        const channel = window.Echo.channel('test-channel');
        console.log('Subscribed to channel:', 'test-channel');
        
        // Try both with and without the dot prefix
        channel.listen('test.message', (e: { message: string }) => {
            console.log('Received message from channel (without dot):', e);
            setReceivedMessages(prev => [...prev, e.message]);
        });
        
        channel.listen('.test.message', (e: { message: string }) => {
            console.log('Received message from channel (with dot):', e);
            setReceivedMessages(prev => [...prev, e.message]);
        });
        
        // Also try listening to all events on this channel
        channel.listenToAll((eventName: string, data: any) => {
            console.log(`Received event ${eventName} with data:`, data);
            if (data && data.message) {
                setReceivedMessages(prev => [...prev, `${eventName}: ${data.message}`]);
            }
        });

        // Update connection status
        window.Echo.connector.pusher.connection.bind('connected', () => {
            console.log('Connection status changed to: Connected');
            setStatus('Connected');
        });

        window.Echo.connector.pusher.connection.bind('disconnected', () => {
            console.log('Connection status changed to: Disconnected');
            setStatus('Disconnected');
        });

        // Check initial connection state
        if (window.Echo.connector.pusher.connection.state === 'connected') {
            console.log('Initial connection state is: connected');
            setStatus('Connected');
        } else {
            console.log('Initial connection state is:', window.Echo.connector.pusher.connection.state);
        }

        return () => {
            // Cleanup subscription when component unmounts
            console.log('Cleaning up Echo channel subscription...');
            channel.stopListening('test.message');
            channel.stopListening('.test.message');
            channel.stopListeningToAll();
            window.Echo.connector.pusher.connection.unbind('connected');
            window.Echo.connector.pusher.connection.unbind('disconnected');
        };
    }, []);

    const sendMessage = async () => {
        if (!message.trim()) return;

        console.log('Sending message:', message);
        try {
            const response = await axios.post('/broadcast', { message });
            console.log('Server response:', response.data);
            setMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <>
            <Head title="WebSocket Test" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h1 className="text-2xl font-semibold mb-4">WebSocket Test</h1>
                            
                            <div className="mb-4">
                                <p className="mb-2">
                                    Connection Status: <span className={status === 'Connected' ? 'text-green-500' : 'text-red-500'}>{status}</span>
                                </p>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="message" className="block text-sm font-medium mb-2">
                                    Message
                                </label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        id="message"
                                        className="flex-1 rounded-l-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 shadow-sm"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                    />
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-r-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                                        onClick={sendMessage}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-medium mb-2">Received Messages</h2>
                                {receivedMessages.length === 0 ? (
                                    <p className="text-gray-500 dark:text-gray-400">No messages received yet.</p>
                                ) : (
                                    <ul className="space-y-2 border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                                        {receivedMessages.map((msg, index) => (
                                            <li key={index} className="border-b pb-2 last:border-b-0 last:pb-0">
                                                {msg}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
