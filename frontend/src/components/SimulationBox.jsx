import React, { useState } from 'react';
import { Send, Upload } from 'lucide-react';

const SimulationBox = ({ onInject, onBulkInject }) => {
    const [mode, setMode] = useState('single');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [file, setFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === 'single') {
            if (!subject || !body) return;
            onInject({ sender: 'customer@example.com', subject, body });
            setSubject('');
            setBody('');
        } else {
            if (!file) return;
            onBulkInject(file);
            setFile(null);
            document.getElementById('bulk-file-input').value = "";
        }
    };

    return (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <h3 className="text-base font-bold mb-4 flex items-center" style={{ color: '#001f5b' }}>
                <Send className="w-4 h-4 mr-2 text-amber-600" />
                Manual Simulator
            </h3>

            <div className="flex space-x-1.5 mb-4 bg-gray-100 p-1 rounded-lg">
                <button
                    onClick={() => setMode('single')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'single'
                        ? 'bg-white text-gray-800 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Single
                </button>
                <button
                    onClick={() => setMode('bulk')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'bulk'
                        ? 'bg-white text-gray-800 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Bulk (File)
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 flex-1 flex flex-col">
                {mode === 'single' ? (
                    <>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1 font-medium">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-200 outline-none text-gray-700"
                                placeholder="e.g. Surrender Request Policy #123"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1 font-medium">Body</label>
                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm h-24 focus:border-blue-400 focus:ring-1 focus:ring-blue-200 outline-none resize-none text-gray-700"
                                placeholder="Type email body..."
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col justify-center items-center border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-amber-400 transition-colors bg-gray-50">
                        <input
                            id="bulk-file-input"
                            type="file"
                            accept=".json,.csv,.txt"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="hidden"
                        />
                        <label htmlFor="bulk-file-input" className="cursor-pointer text-center">
                            <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                            <div className="text-sm font-semibold" style={{ color: '#001f5b' }}>
                                {file ? file.name : "Select File"}
                            </div>
                            <div className="text-gray-400 text-xs mt-1">
                                {file ? `${(file.size / 1024).toFixed(1)} KB` : "Drop .json, .csv or .txt here"}
                            </div>
                        </label>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full font-bold py-2.5 px-4 rounded-lg transition-all flex justify-center items-center mt-auto text-sm shadow-sm hover:shadow-md text-white"
                    style={{ background: '#001f5b' }}
                    onMouseEnter={(e) => e.target.style.background = '#002d80'}
                    onMouseLeave={(e) => e.target.style.background = '#001f5b'}
                >
                    {mode === 'single' ? 'Inject Traffic' : 'Upload Bulk Data'}
                </button>
            </form>
        </div>
    );
};

export default SimulationBox;
