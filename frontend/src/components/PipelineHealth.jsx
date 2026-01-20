import React from 'react';
import { Activity } from 'lucide-react';

const PipelineHealth = ({ isIngesting }) => {
    return (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <Activity className={`w-6 h-6 ${isIngesting ? 'text-green-400 animate-pulse' : 'text-gray-500'}`} />
                <div>
                    <h3 className="font-semibold text-lg">System Health</h3>
                    <p className="text-sm text-gray-400">
                        {isIngesting ? "Pipeline Active - Processing Real-time" : "Pipeline Idle"}
                    </p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <span className={`h-3 w-3 rounded-full ${isIngesting ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                <span className="text-sm uppercase tracking-wider font-medium text-gray-300">
                    {isIngesting ? "Operational" : "Standby"}
                </span>
            </div>
        </div>
    );
};

export default PipelineHealth;
