import React, { useState } from 'react';
import { User, Tag, Lightbulb, Mail, Send, XCircle, Edit, CheckCircle, AlertTriangle } from 'lucide-react';

/**
 * EmailTile Component — LIC Light Theme
 * 
 * Priority Color Scheme (Light Mode):
 * - HIGH: Red left border + light red tint
 * - MEDIUM: Navy left border + neutral
 * - LOW: Green left border + light green tint
 */

const getPriorityStyles = (priority) => {
    switch (priority?.toUpperCase()) {
        case 'HIGH':
            return {
                container: 'bg-red-50 border-l-red-500 hover:bg-red-100/70',
                badge: 'bg-red-100 text-red-700 border-red-200',
                icon: 'text-red-500'
            };
        case 'LOW':
            return {
                container: 'bg-emerald-50 border-l-emerald-500 hover:bg-emerald-100/70',
                badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                icon: 'text-emerald-500'
            };
        default: // MEDIUM or undefined
            return {
                container: 'bg-white border-l-amber-500 hover:bg-gray-50',
                badge: 'bg-amber-50 text-amber-700 border-amber-200',
                icon: 'text-gray-500'
            };
    }
};

const getSentimentStyles = (sentiment) => {
    switch (sentiment?.toUpperCase()) {
        case 'NEGATIVE':
            return 'bg-red-50 text-red-700 border-red-200';
        case 'POSITIVE':
            return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        default:
            return 'bg-gray-100 text-gray-600 border-gray-200';
    }
};

const EmailTile = ({ email }) => {
    const priority = email.analysis?.priority || 'MEDIUM';
    const styles = getPriorityStyles(priority);

    // Reply State
    const [replyDraft, setReplyDraft] = useState(email.generated_reply || '');
    const [status, setStatus] = useState(email.reply_status || 'PENDING');
    const [sending, setSending] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    // Safety Checks
    const isHighPriority = priority === 'HIGH';
    const isRestrictedIntent = ["COMPLAINT", "CLAIM_RELATED", "PAYMENT_ISSUE"].includes(email.analysis?.intent);
    const isNoReply = email.generated_reply === 'NO_REPLY';
    const canSend = !isHighPriority && !isRestrictedIntent && (replyDraft && replyDraft !== 'NO_REPLY');

    const handleAction = async (action) => {
        setSending(true);
        setErrorMsg(null);
        try {
            const endpoint = `http://localhost:8000/api/emails/${email.id}/reply`;
            const payload = {
                action: action,
                body: action === 'approve_send' ? replyDraft : null
            };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Action failed');
            }

            if (action === 'approve_send') {
                setStatus('SENT');
            } else {
                setStatus('REJECTED');
            }
        } catch (err) {
            console.error("Reply action error:", err);
            setErrorMsg(err.message);
        } finally {
            setSending(false);
        }
    };

    return (
        <div
            className={`
                ${styles.container}
                border-l-4 border border-gray-200
                rounded-lg p-4 
                transition-all duration-200 
                cursor-default
                shadow-sm hover:shadow-md
                flex flex-col h-full
            `}
        >
            {/* Header Section */}
            <div>
                {/* Priority Badge */}
                <div className="flex justify-between items-start mb-3">
                    <span className={`
                        ${styles.badge}
                        px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border tracking-wide
                    `}>
                        {priority}
                    </span>

                    {/* Status Indicator */}
                    <div className="flex items-center space-x-2">
                        {status === 'SENT' && <span className="text-emerald-600 text-xs font-bold flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> SENT</span>}
                        {status === 'REJECTED' && <span className="text-red-500 text-xs font-bold flex items-center"><XCircle className="w-3 h-3 mr-1" /> REJECTED</span>}
                        {status === 'PENDING' && <span className="text-gray-400 text-[10px] font-semibold uppercase tracking-wide">Pending Review</span>}
                    </div>
                </div>

                {/* Sender */}
                <div className="flex items-center space-x-2 mb-2">
                    <User className={`w-4 h-4 ${styles.icon}`} />
                    <span className="text-sm text-gray-600 truncate font-medium" title={email.sender}>
                        {email.sender}
                    </span>
                </div>

                {/* Subject */}
                <div className="flex items-start space-x-2 mb-3">
                    <Mail className={`w-4 h-4 ${styles.icon} mt-0.5 flex-shrink-0`} />
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2" title={email.subject}>
                        {email.subject}
                    </h3>
                </div>

                {/* Summary */}
                <div className="flex items-start space-x-2 mb-3 min-h-[40px]">
                    <Lightbulb className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                    <p className="text-xs text-gray-500 line-clamp-3">
                        {email.analysis?.summary || email.suggested_action || 'Pending Analysis...'}
                    </p>
                </div>
            </div>

            {/* Spacer */}
            <div className="flex-grow"></div>

            {/* ═══════ HUMAN-IN-THE-LOOP REPLY PANEL ═══════ */}
            <div className="mt-2 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase flex items-center tracking-wide">
                        <Edit className="w-3 h-3 mr-1" /> Suggested Reply
                    </span>

                    {/* Safety Badges */}
                    {isHighPriority && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded border border-red-200 font-medium">High Priority Block</span>}
                    {isRestrictedIntent && <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded border border-orange-200 font-medium">Restricted Intent</span>}
                </div>

                {/* Editable Text Area */}
                {status === 'PENDING' ? (
                    <div className="relative">
                        {/* Safety Overlay */}
                        {(isNoReply || isHighPriority || isRestrictedIntent) && (
                            <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-2 rounded-md z-10 border border-gray-200">
                                <AlertTriangle className="w-5 h-5 text-amber-500 mb-1" />
                                <p className="text-xs text-gray-700 font-medium">Manual Handling Required</p>
                                <p className="text-[10px] text-gray-500">
                                    {isHighPriority ? "Priority is HIGH." :
                                        isRestrictedIntent ? "Restricted Intent." :
                                            "AI declined to draft a reply."}
                                </p>
                            </div>
                        )}

                        <textarea
                            className={`
                                w-full bg-gray-50 border border-gray-200 rounded-md p-2 text-xs text-gray-700 
                                focus:border-blue-400 focus:ring-1 focus:ring-blue-200 outline-none
                                resize-none min-h-[90px]
                                ${(!canSend) ? 'opacity-40' : ''}
                            `}
                            value={replyDraft === 'NO_REPLY' ? 'No reply generated.' : replyDraft}
                            onChange={(e) => setReplyDraft(e.target.value)}
                            disabled={!canSend || sending}
                        />
                    </div>
                ) : (
                    /* Read-Only View for Sent/Rejected */
                    <div className={`
                        p-3 rounded-md border text-xs min-h-[70px]
                        ${status === 'SENT' ? 'bg-emerald-50 border-emerald-200 text-gray-700' : 'bg-red-50 border-red-200 text-gray-500 italic'}
                    `}>
                        {status === 'SENT' ? replyDraft : "Reply rejected by operator."}
                    </div>
                )}

                {/* Error Message */}
                {errorMsg && (
                    <div className="mt-2 text-xs text-red-600 bg-red-50 p-1.5 rounded border border-red-200">
                        Error: {errorMsg}
                    </div>
                )}

                {/* Action Buttons */}
                {status === 'PENDING' && (
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={() => handleAction('approve_send')}
                            disabled={!canSend || sending}
                            className={`
                                flex-1 py-1.5 px-3 rounded-md text-xs font-bold flex items-center justify-center
                                transition-colors
                                ${(!canSend || sending)
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'}
                            `}
                        >
                            {sending ? 'Sending...' : <><Send className="w-3 h-3 mr-1.5" /> Approve & Send</>}
                        </button>

                        <button
                            onClick={() => handleAction('reject')}
                            disabled={sending}
                            className={`
                                flex-1 py-1.5 px-3 rounded-md text-xs font-bold flex items-center justify-center
                                border border-gray-300 hover:bg-gray-100 text-gray-600
                                transition-colors
                                ${sending ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            <XCircle className="w-3 h-3 mr-1.5" /> Reject
                        </button>
                    </div>
                )}
            </div>

            {/* Metadata Footer */}
            <div className="flex flex-wrap gap-1.5 pt-3 mt-2 border-t border-gray-200/80">
                <span
                    className="px-1.5 py-0.5 rounded text-[10px] font-semibold border"
                    style={{ background: '#eef2ff', color: '#001f5b', borderColor: '#c7d2fe' }}
                >
                    {email.analysis?.intent || 'N/A'}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getSentimentStyles(email.analysis?.sentiment)}`}>
                    {email.analysis?.sentiment || 'N/A'}
                </span>
                {email.analysis?.confidence && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                        {email.analysis.confidence}
                    </span>
                )}
            </div>
        </div>
    );
};

export default EmailTile;
