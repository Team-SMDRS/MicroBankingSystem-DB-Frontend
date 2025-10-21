import React from 'react';

interface ConfirmationModalProps {
    open: boolean;
    title?: string;
    details: Array<{ label: string; value: React.ReactNode }>;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ open, title = 'Please confirm', details, onConfirm, onCancel, isLoading = false, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">{title}</h3>

                <div className="space-y-2 mb-6">
                    {details.map((d, i) => (
                        <div key={i} className="flex justify-between border-b pb-2">
                            <div className="text-sm text-slate-600">{d.label}</div>
                            <div className="text-sm font-medium text-slate-800">{d.value}</div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-3">
                    <button onClick={onCancel} disabled={isLoading} className="px-4 py-2 rounded-lg border hover:bg-slate-50 disabled:opacity-50">{cancelText}</button>
                    <button onClick={onConfirm} disabled={isLoading} className={`px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 ${isLoading ? 'cursor-wait' : ''}`}>
                        {isLoading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
