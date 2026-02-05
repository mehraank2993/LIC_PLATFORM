import React, { useState } from 'react';
import { User, Tag, Lightbulb, Mail, Send, XCircle, Edit, CheckCircle, AlertTriangle } from 'lucide-react';

/**
 * EmailTile Component
 * 
 * Displays individual email as a card/tile with priority-based color coding.
 * Now includes HUMAN-IN-THE-LOOP Reply Workflow.
 * 
 * Priority Color Scheme:
 * - HIGH: Red accent border + subtle red background tint
 * - MEDIUM: Gray accent border + neutral background
 * - LOW: Green accent border + subtle green background tint
 */

const getPriorityStyles = (priority) => {
    switch (priority?.toUpperCase()) {
        case 'HIGH':
            return {
                container: 'bg-red-500/5 border-l-red-500 hover:bg-red-500/10',
                badge: 'bg-red-900 text-red-300 border-red-700',
                icon: 'text-red-400'
            };
        case 'LOW':
            return {
                container: 'bg-green-500/5 border-l-green-500 hover:bg-green-500/10',
                badge: 'bg-green-900 text-green-300 border-green-700',
                icon: 'text-green-400'
            };
        default: // MEDIUM or undefined
            return {
                container: 'bg-gray-800 border-l-gray-600 hover:bg-gray-750',
                badge: 'bg-gray-700 text-gray-300 border-gray-600',
                icon: 'text-gray-400'
            };
    }
};

const getSentimentStyles = (sentiment) => {
    switch (sentiment?.toUpperCase()) {
        case 'NEGATIVE':
            return 'bg-red-900 text-red-300 border-red-700';
        case 'POSITIVE':
            return 'bg-green-900 text-green-300 border-green-700';
        default:
            return 'bg-gray-700 text-gray-300 border-gray-600';
    }
};

const EmailTile = ({ email }) => {
    const priority = email.analysis?.priority || 'MEDIUM';
    const styles = getPriorityStyles(priority);

    // Reply State
    const [replyDraft, setReplyDraft] = useState(email.generated_reply || '');
    const [status, setStatus] = useState(email.reply_status || 'PENDING'); // PENDING, SENT, REJECTED, ERROR
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
            const endpoint = `http://localhost:8001/api/emails/${email.id}/reply`;
            const payload = {
                action: action, // 'approve_send' or 'reject'
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

            // Update UI on success
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
                border-l-4 border-t border-r border-b border-gray-700
                rounded-lg p-4 
                transition-all duration-200 
                cursor-default
                shadow-lg hover:shadow-xl
                flex flex-col h-full
            `}
        >
            {/* Header Section */}
            <div>
                {/* Priority Badge */}
                <div className="flex justify-between items-start mb-3">
                    <span className={`
                        ${styles.badge}
                        px-2 py-1 rounded-md text-xs font-bold uppercase border
                    `}>
                        {priority}
                    </span>

                    {/* Status Indicator */}
                    <div className="flex items-center space-x-2">
                        {status === 'SENT' && <span className="text-green-400 text-xs font-bold flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> SENT</span>}
                        {status === 'REJECTED' && <span className="text-red-400 text-xs font-bold flex items-center"><XCircle className="w-3 h-3 mr-1" /> REJECTED</span>}
                        {status === 'PENDING' && <span className="text-gray-400 text-xs font-bold">PENDING REVIEW</span>}
                    </div>
                </div>

                {/* Sender */}
                <div className="flex items-center space-x-2 mb-2">
                    <User className={`w-4 h-4 ${styles.icon}`} />
                    <span className="text-sm text-gray-300 truncate" title={email.sender}>
                        {email.sender}
                    </span>
                </div>

                {/* Subject */}
                <div className="flex items-start space-x-2 mb-3">
                    <Mail className={`w-4 h-4 ${styles.icon} mt-0.5 flex-shrink-0`} />
                    <h3 className="text-sm font-semibold text-white line-clamp-2" title={email.subject}>
                        {email.subject}
                    </h3>
                </div>

                {/* Summary */}
                <div className="flex items-start space-x-2 mb-3 min-h-[40px]">
                    <Lightbulb className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                    <p className="text-xs text-gray-400 line-clamp-3">
                        {email.analysis?.summary || email.suggested_action || 'Pending Analysis...'}
                    </p>
                </div>
            </div>

            {/* Spacer to push reply section bottom if needed, but flex-col handles natural flow */}
            <div className="flex-grow"></div>

            {/* ════════════════════════════════════════════════════════════════════════
               HUMAN-IN-THE-LOOP REPLY PANEL
               ════════════════════════════════════════════════════════════════════════ */}

            <div className="mt-2 pt-3 border-t border-gray-700">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase flex items-center">
                        <Edit className="w-3 h-3 mr-1" /> Suggested Reply
                    </span>

                    {/* Safety Badges */}
                    {isHighPriority && <span className="text-[10px] bg-red-900/50 text-red-300 px-1.5 py-0.5 rounded border border-red-800">High Priority Block</span>}
                    {isRestrictedIntent && <span className="text-[10px] bg-orange-900/50 text-orange-300 px-1.5 py-0.5 rounded border border-orange-800">Restricted Intent</span>}
                </div>

                {/* Editable Text Area */}
                {status === 'PENDING' ? (
                    <div className="relative">
                        {/* Safety Overlay for NO_REPLY or Blocked */}
                        {(isNoReply || isHighPriority || isRestrictedIntent) && (
                            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-2 rounded-md z-10 border border-gray-700">
                                <AlertTriangle className="w-6 h-6 text-yellow-500 mb-1" />
                                <p className="text-xs text-gray-200 font-medium">Manual Handling Required</p>
                                <p className="text-[10px] text-gray-400">
                                    {isHighPriority ? "Priority is HIGH." :
                                        isRestrictedIntent ? "Restricted Intent." :
                                            "AI declined to draft a reply."}
                                </p>
                            </div>
                        )}

                        <textarea
                            className={`
                                w-full bg-gray-900/50 border border-gray-700 rounded-md p-2 text-xs text-gray-300 
                                focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none
                                resize-none min-h-[100px]
                                ${(!canSend) ? 'opacity-30' : ''}
                            `}
                            value={replyDraft === 'NO_REPLY' ? 'No reply generated.' : replyDraft}
                            onChange={(e) => setReplyDraft(e.target.value)}
                            disabled={!canSend || sending}
                        />
                    </div>
                ) : (
                    /* Read-Only View for Sent/Rejected */
                    <div className={`
                        p-3 rounded-md border text-xs min-h-[80px]
                        ${status === 'SENT' ? 'bg-green-900/10 border-green-800 text-gray-300' : 'bg-red-900/10 border-red-800 text-gray-400 italic'}
                    `}>
                        {status === 'SENT' ? replyDraft : "Reply rejected by operator."}
                    </div>
                )}

                {/* Error Message */}
                {errorMsg && (
                    <div className="mt-2 text-xs text-red-400 bg-red-900/20 p-1.5 rounded border border-red-900/50">
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
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-green-700 hover:bg-green-600 text-white shadow-lg shadow-green-900/20'}
                            `}
                        >
                            {sending ? 'Sending...' : <><Send className="w-3 h-3 mr-1.5" /> Approve & Send</>}
                        </button>

                        <button
                            onClick={() => handleAction('reject')}
                            disabled={sending}
                            className={`
                                flex-1 py-1.5 px-3 rounded-md text-xs font-bold flex items-center justify-center
                                border border-gray-600 hover:bg-gray-700 text-gray-300
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
            <div className="flex flex-wrap gap-2 pt-3 mt-2 border-t border-gray-700/50 opacity-75">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-900/50 text-indigo-300 border border-indigo-800">
                    {email.analysis?.intent || 'N/A'}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${getSentimentStyles(email.analysis?.sentiment)} bg-opacity-50`}>
                    {email.analysis?.sentiment || 'N/A'}
                </span>
                {email.analysis?.confidence && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-700 text-gray-400 border border-gray-600">
                        {email.analysis.confidence}
                    </span>
                )}
            </div>
        </div>
    );
};

export default EmailTile;
