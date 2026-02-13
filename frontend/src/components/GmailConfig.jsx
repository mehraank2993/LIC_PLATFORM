import React, { useState, useEffect } from 'react';
import { Mail, Plus, Trash2, RefreshCw, CheckCircle, AlertCircle, Loader, Power, PowerOff } from 'lucide-react';

const GmailConfig = ({ onSync }) => {
    const [accounts, setAccounts] = useState([]);
    const [stats, setStats] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const [formData, setFormData] = useState({
        gmail_email: '',
        auth_method: 'token',
        api_key: ''
    });

    const fetchGmailAccounts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/gmail/accounts');
            const data = await response.json();
            if (data.status === 'success') {
                setAccounts(data.data.accounts || []);
                setStats(data.data.stats || {});
            } else {
                setError('Failed to fetch Gmail accounts');
            }
        } catch (err) {
            setError('Error connecting to server: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConnect = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        if (!formData.gmail_email || !formData.api_key) {
            setError('Please fill in all fields');
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/gmail/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.status === 'success') {
                setSuccessMsg(`Successfully connected: ${formData.gmail_email}`);
                setFormData({ gmail_email: '', auth_method: 'token', api_key: '' });
                setShowForm(false);
                fetchGmailAccounts();
                setTimeout(() => setSuccessMsg(''), 3000);
            } else {
                setError(data.message || 'Failed to connect Gmail account');
            }
        } catch (err) {
            setError('Error: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSync = async (gmail_email = null) => {
        setIsSyncing(true);
        try {
            const url = gmail_email
                ? `http://localhost:8000/api/gmail/sync?gmail_email=${encodeURIComponent(gmail_email)}`
                : 'http://localhost:8000/api/gmail/sync';
            const response = await fetch(url, { method: 'POST' });
            const data = await response.json();
            if (data.status === 'syncing') {
                setSuccessMsg(`Sync started for ${gmail_email || 'all accounts'}`);
                fetchGmailAccounts();
                if (onSync) onSync();
                setTimeout(() => setSuccessMsg(''), 3000);
            } else {
                setError('Failed to start sync');
            }
        } catch (err) {
            setError('Error: ' + err.message);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleToggle = async (gmail_email, enabled) => {
        try {
            const response = await fetch(
                `http://localhost:8000/api/gmail/toggle?gmail_email=${encodeURIComponent(gmail_email)}&enabled=${!enabled}`,
                { method: 'POST' }
            );
            const data = await response.json();
            if (data.status === 'success') {
                fetchGmailAccounts();
            } else {
                setError('Failed to toggle sync');
            }
        } catch (err) {
            setError('Error: ' + err.message);
        }
    };

    const handleDisconnect = async (gmail_email) => {
        if (!window.confirm(`Are you sure you want to disconnect ${gmail_email}?`)) return;
        try {
            const response = await fetch(
                `http://localhost:8000/api/gmail/disconnect?gmail_email=${encodeURIComponent(gmail_email)}`,
                { method: 'DELETE' }
            );
            const data = await response.json();
            if (data.status === 'success') {
                setSuccessMsg(`Disconnected: ${gmail_email}`);
                fetchGmailAccounts();
                setTimeout(() => setSuccessMsg(''), 3000);
            } else {
                setError('Failed to disconnect');
            }
        } catch (err) {
            setError('Error: ' + err.message);
        }
    };

    useEffect(() => {
        fetchGmailAccounts();
        const interval = setInterval(fetchGmailAccounts, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-base font-bold flex items-center" style={{ color: '#001f5b' }}>
                    <Mail className="w-4 h-4 mr-2 text-amber-600" />
                    Gmail Integration
                </h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all text-white shadow-sm hover:shadow-md"
                    style={{ background: '#001f5b' }}
                    disabled={isLoading}
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add Account
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-600 text-xs">{error}</p>
                </div>
            )}

            {/* Success Message */}
            {successMsg && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-emerald-600 text-xs">{successMsg}</p>
                </div>
            )}

            {/* Connect Form */}
            {showForm && (
                <div className="mb-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-sm text-gray-800 mb-3">Connect Gmail Account</h4>
                    <form onSubmit={handleConnect} className="space-y-3">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1 font-medium">Gmail Email</label>
                            <input
                                type="email"
                                placeholder="your.email@gmail.com"
                                value={formData.gmail_email}
                                onChange={(e) => setFormData({ ...formData, gmail_email: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500 mb-1 font-medium">Auth Method</label>
                            <select
                                value={formData.auth_method}
                                onChange={(e) => setFormData({ ...formData, auth_method: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                            >
                                <option value="token">Access Token</option>
                                <option value="service_account">Service Account JSON</option>
                                <option value="oauth">OAuth (Browser Login)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500 mb-1 font-medium">
                                {formData.auth_method === 'service_account' ? 'Service Account JSON' : 'API Key / Token'}
                            </label>
                            <textarea
                                placeholder={formData.auth_method === 'token'
                                    ? 'Paste your OAuth access token here...'
                                    : 'Paste your service account JSON here...'}
                                value={formData.api_key}
                                onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 font-mono text-xs"
                                rows="3"
                                required
                            />
                        </div>

                        <div className="flex gap-2 pt-1">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-lg transition text-xs font-medium flex items-center justify-center gap-1.5"
                            >
                                {isLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                                {isLoading ? 'Connecting...' : 'Connect'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setFormData({ gmail_email: '', auth_method: 'token', api_key: '' });
                                    setError('');
                                }}
                                className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition text-xs font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Stats */}
            {accounts.length > 0 && (
                <div className="mb-5 grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Accounts</p>
                        <p className="text-xl font-bold" style={{ color: '#001f5b' }}>{stats.total_accounts || 0}</p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Synced</p>
                        <p className="text-xl font-bold" style={{ color: '#001f5b' }}>{stats.total_emails_synced || 0}</p>
                    </div>
                </div>
            )}

            {/* Accounts List */}
            {isLoading && !accounts.length ? (
                <div className="flex justify-center py-8">
                    <Loader className="w-5 h-5 animate-spin text-gray-400" />
                </div>
            ) : accounts.length > 0 ? (
                <div className="space-y-3">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wide">Connected Accounts</h4>
                        <button
                            onClick={() => handleSync()}
                            disabled={isSyncing}
                            className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium rounded-md transition text-white"
                            style={{ background: '#001f5b' }}
                        >
                            {isSyncing ? (
                                <><Loader className="w-3 h-3 animate-spin" /> Syncing...</>
                            ) : (
                                <><RefreshCw className="w-3 h-3" /> Sync All</>
                            )}
                        </button>
                    </div>

                    {accounts.map((account) => (
                        <div key={account.gmail_email} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2.5">
                            <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-gray-800 truncate">{account.gmail_email}</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">{account.auth_method}</p>
                                </div>
                                <div>
                                    {account.sync_enabled ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
                                            <CheckCircle className="w-3 h-3" /> Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-gray-200 text-gray-500 rounded-full">
                                            Paused
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Sync Info */}
                            <div className="text-xs text-gray-500 space-y-0.5">
                                {account.last_sync_time ? (
                                    <>
                                        <p>Last sync: <span className="text-gray-700">{new Date(account.last_sync_time).toLocaleString()}</span></p>
                                        <p>Emails synced: <span className="font-semibold text-gray-700">{account.total_synced}</span></p>
                                        {account.last_sync_status === 'success' ? (
                                            <p className="text-emerald-600 font-medium">✓ Last sync successful</p>
                                        ) : account.last_sync_status === 'failed' ? (
                                            <p className="text-red-500 font-medium">✗ Last sync failed{account.last_sync_error ? `: ${account.last_sync_error}` : ''}</p>
                                        ) : (
                                            <p className="text-amber-500 font-medium">◐ Pending</p>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-amber-500 font-medium">Not synced yet</p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-1.5 pt-1.5">
                                <button
                                    onClick={() => handleSync(account.gmail_email)}
                                    disabled={isSyncing}
                                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-md transition disabled:opacity-50"
                                >
                                    {isSyncing ? <Loader className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                                    Sync
                                </button>

                                <button
                                    onClick={() => handleToggle(account.gmail_email, account.sync_enabled)}
                                    className={`flex-1 px-2 py-1.5 text-[11px] font-medium rounded-md transition border ${account.sync_enabled
                                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 border-gray-200'
                                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                                        }`}
                                >
                                    {account.sync_enabled ? 'Pause' : 'Resume'}
                                </button>

                                <button
                                    onClick={() => handleDisconnect(account.gmail_email)}
                                    className="flex items-center justify-center px-2 py-1.5 text-[11px] bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-md transition"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <Mail className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm font-medium">No Gmail accounts connected</p>
                    <p className="text-xs text-gray-400 mt-1">Add an account to start syncing emails</p>
                </div>
            )}
        </div>
    );
};

export default GmailConfig;
