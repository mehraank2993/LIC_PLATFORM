import React from 'react';
import { Mail, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

const statConfigs = [
    {
        icon: Mail,
        label: 'Pending Emails',
        key: 'pending',
        gradient: 'from-blue-50 to-blue-100',
        border: 'border-blue-200',
        iconColor: 'text-blue-600',
        valueBg: 'text-blue-900'
    },
    {
        icon: Clock,
        label: 'Avg Processing (s)',
        key: 'avg_latency',
        gradient: 'from-amber-50 to-amber-100',
        border: 'border-amber-200',
        iconColor: 'text-amber-600',
        valueBg: 'text-amber-900'
    },
    {
        icon: CheckCircle,
        label: 'Completed',
        key: 'completed',
        gradient: 'from-emerald-50 to-emerald-100',
        border: 'border-emerald-200',
        iconColor: 'text-emerald-600',
        valueBg: 'text-emerald-900'
    },
    {
        icon: AlertTriangle,
        label: 'Failed',
        key: 'failed',
        gradient: 'from-rose-50 to-rose-100',
        border: 'border-rose-200',
        iconColor: 'text-rose-600',
        valueBg: 'text-rose-900'
    },
];

const StatsGrid = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {statConfigs.map(({ icon: Icon, label, key, gradient, border, iconColor, valueBg }) => (
                <div
                    key={key}
                    className={`
                        bg-gradient-to-br ${gradient} ${border}
                        border rounded-xl p-5
                        flex items-center space-x-4
                        hover:shadow-md transition-all duration-200
                    `}
                >
                    <div className={`
                        p-3 rounded-lg bg-white/70 shadow-sm
                    `}>
                        <Icon className={`w-7 h-7 ${iconColor}`} />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
                        <p className={`text-2xl font-bold ${valueBg}`}>{stats[key] || 0}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsGrid;
