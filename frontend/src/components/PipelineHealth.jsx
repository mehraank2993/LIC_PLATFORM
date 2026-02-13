import React from 'react';
import { Activity } from 'lucide-react';

const PipelineHealth = ({ isIngesting }) => {
    return (
        <div
            className={`
                rounded-xl mb-8 p-5 flex items-center justify-between border
                transition-all duration-300
                ${isIngesting
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-gray-50 border-gray-200'
                }
            `}
        >
            <div className="flex items-center space-x-4">
                <div className={`
                    p-2 rounded-lg
                    ${isIngesting ? 'bg-emerald-100' : 'bg-gray-200'}
                `}>
                    <Activity className={`w-5 h-5 ${isIngesting ? 'text-emerald-600 animate-pulse' : 'text-gray-500'}`} />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800">System Health</h3>
                    <p className={`text-sm ${isIngesting ? 'text-emerald-600' : 'text-gray-500'}`}>
                        {isIngesting ? "Pipeline Active — Processing Real-time" : "Pipeline Idle"}
                    </p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <span className={`
                    h-2.5 w-2.5 rounded-full
                    ${isIngesting ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}
                `}></span>
                <span className={`
                    text-xs uppercase tracking-wider font-semibold
                    ${isIngesting ? 'text-emerald-600' : 'text-gray-500'}
                `}>
                    {isIngesting ? "Operational" : "Standby"}
                </span>
            </div>
        </div>
    );
};

export default PipelineHealth;
