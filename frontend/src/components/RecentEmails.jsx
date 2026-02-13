import React from 'react';
import { FileText, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import EmailTile from './EmailTile';

const RecentEmails = ({ emails, currentPage, totalPages, onPageChange }) => {
    return (
        <div className="tile-transparent rounded-xl overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center" style={{ color: '#001f5b' }}>
                    <FileText className="w-5 h-5 mr-2 text-amber-600" />
                    Live Feed
                </h2>
                <span className="text-xs text-gray-400 font-medium">
                    {emails.length > 0 ? `${emails.length} showing` : ''}
                </span>
            </div>

            {/* Tile Grid Layout */}
            <div className="p-5 bg-gray-50/50">
                {emails.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {emails.map((email) => (
                            <EmailTile key={email.id} email={email} />
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-400">
                        <Mail className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                        <p className="font-medium">No emails found</p>
                        <p className="text-sm mt-1">Waiting for ingestion...</p>
                    </div>
                )}
            </div>

            {/* Pagination Footer */}
            <div className="px-5 py-3 border-t border-gray-100 flex justify-between items-center bg-white">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`
                        flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                        ${currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                    `}
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </button>

                <span className="text-gray-500 text-sm">
                    Page <span className="font-bold text-gray-800">{currentPage}</span> of {totalPages}
                </span>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className={`
                        flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                        ${currentPage >= totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                    `}
                >
                    Next
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default RecentEmails;
