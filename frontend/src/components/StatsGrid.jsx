import React from 'react';
import { Mail, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex items-center space-x-4">
        <div className={`p-3 rounded-full bg-opacity-20 ${color}`}>
            <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
            <p className="text-gray-400 text-sm">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const StatsGrid = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                icon={Mail}
                label="Pending Emails"
                value={stats.pending || 0}
                color="bg-blue-500 text-blue-500"
            />
            <StatCard
                icon={Clock}
                label="Avg Processing (s)"
                value={stats.avg_latency || 0}
                color="bg-yellow-500 text-yellow-500"
            />
            <StatCard
                icon={CheckCircle}
                label="Completed"
                value={stats.completed || 0}
                color="bg-green-500 text-green-500"
            />
            <StatCard
                icon={AlertTriangle}
                label="Failed"
                value={stats.failed || 0}
                color="bg-red-500 text-red-500"
            />
        </div>
    );
};

export default StatsGrid;
