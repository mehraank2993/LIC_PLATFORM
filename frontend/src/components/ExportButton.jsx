import React from 'react';
import { Download } from 'lucide-react';

const ExportButton = () => {
    const handleDownload = () => {
        window.open('/api/export', '_blank');
    };

    return (
        <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm font-medium border shadow-sm hover:shadow-md"
            style={{
                background: '#fff',
                color: '#001f5b',
                borderColor: '#001f5b'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#001f5b'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#001f5b'; }}
        >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
        </button>
    );
};

export default ExportButton;
