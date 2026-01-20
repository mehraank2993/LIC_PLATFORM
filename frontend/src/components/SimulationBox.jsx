import React, { useState } from 'react';
import { Send } from 'lucide-react';

const SimulationBox = ({ onInject }) => {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!subject || !body) return;
        onInject({ sender: 'customer@example.com', subject, body });
        setSubject('');
        setBody('');
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-full">
            <h3 className="text-lg font-bold mb-4 flex items-center">
                <Send className="w-5 h-5 mr-2 text-pink-500" />
                Manual Simulator
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Subject</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm focus:border-pink-500 outline-none"
                        placeholder="e.g. Surrender Request Policy #123"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Body</label>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm h-24 focus:border-pink-500 outline-none resize-none"
                        placeholder="Type email body..."
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded transition-colors flex justify-center items-center"
                >
                    Inject Traffic
                </button>
            </form>
        </div>
    );
};

export default SimulationBox;
