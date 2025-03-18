import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function BroadcastIndex() {
    const [message, setMessage] = useState('');
    const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
    const [status, setStatus] = useState('Disconnected');

    useEffect(() => {
        // Subscribe to the test channel
        const channel = window.Echo.channel('test-channel');
        
        // Listen for messages
        channel.listen('.test.message', (e: { message: string }) => {
            // Get current messages and add the new one
            const updatedMessages = [...receivedMessages, e.message];
            setReceivedMessages(updatedMessages);
        });

        // Update connection status
        window.Echo.connector.pusher.connection.bind('connected', () => {
            setStatus('Connected');
        });

        window.Echo.connector.pusher.connection.bind('disconnected', () => {
            setStatus('Disconnected');
        });

        // Check initial connection state
        if (window.Echo.connector.pusher.connection.state === 'connected') {
            setStatus('Connected');
        }
        
        return () => {
            // Cleanup subscription when component unmounts
            channel.stopListening('test.message');
            channel.stopListeningToAll();
            window.Echo.connector.pusher.connection.unbind('connected');
            window.Echo.connector.pusher.connection.unbind('disconnected');
        };
    }, []);

    const sendMessage = () => {
        if (!message.trim()) return;

        // Use Inertia router for the POST request
        // No need for async/await as router.post doesn't return a Promise
        router.post('/broadcast', { message }, {
            preserveScroll: true,  // Maintain scroll position
            onSuccess: () => {
                setMessage('');  // Clear the input field on success
            }
        });
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
