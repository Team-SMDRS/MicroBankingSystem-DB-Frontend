import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaPiggyBank, FaUniversity, FaFilePdf } from 'react-icons/fa';

// CORRECTED: All imports are now fixed
import { useAuth } from '../store/authContex';
import { mockCustomers, mockSavingsAccounts, mockFixedDeposits, mockTransactions } from '../api/testData';
import Button from '../components/ui/button';
import Modal from '../components/ui/modal';
import type { SavingsAccount, Customer } from '../types';

// NOTE: The forms below are not currently used because the buttons now navigate to separate pages.
const TransactionForm: React.FC<{ accounts: SavingsAccount[], onClose: () => void }> = () => {
    return <form>...</form>; // Your form code would be here
};
const TransferForm: React.FC<{ accounts: SavingsAccount[], onClose: () => void }> = () => {
    return <form>...</form>; // Your form code would be here
};
const CreateFDForm: React.FC<{ accounts: SavingsAccount[], onClose: () => void }> = () => {
    return <form>...</form>; // Your form code would be here
};


// The Main, Clean, and Unified Customer Detail Page
const CustomerDetailPage: React.FC = () => {
    const { customerId } = useParams<{ customerId: string }>();
    const { agent } = useAuth();
    const navigate = useNavigate();

    // NOTE: This modal state is not currently used by the action buttons.
    const [modal, setModal] = useState<'transaction' | 'transfer' | 'createFd' | null>(null);

    const customer = mockCustomers.find(c => c.customerId === customerId);

    if (!customer) {
        return <div className="p-8 text-center text-red-500">Customer not found!</div>;
    }

    const isResponsibleAgent = agent?.agentId === customer.assignedAgentId;
    const savingsAccounts = mockSavingsAccounts.filter(acc => acc.customerId === customerId);
    const accountIds = savingsAccounts.map(acc => acc.accountId);

    return (
        <div className="bg-slate-50 min-h-screen p-8">
            {/* The Modal components below are not currently used. */}
            <Modal isOpen={modal === 'transaction'} onClose={() => setModal(null)} title="Deposit or Withdraw">
                <TransactionForm accounts={savingsAccounts} onClose={() => setModal(null)} />
            </Modal>
            <Modal isOpen={modal === 'transfer'} onClose={() => setModal(null)} title="Transfer Funds">
                <TransferForm accounts={savingsAccounts} onClose={() => setModal(null)} />
            </Modal>
            <Modal isOpen={modal === 'createFd'} onClose={() => setModal(null)} title="Create Fixed Deposit">
                <CreateFDForm accounts={savingsAccounts} onClose={() => setModal(null)} />
            </Modal>

            {/* CORRECTED: The broken navigation logic has been removed. */}

            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                    <FaUserCircle className="text-slate-400" size={48} />
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">{customer.name}</h1>
                        <p className="text-slate-500">Customer ID: {customer.customerId}</p>
                    </div>
                </div>
                <Button variant="secondary" onClick={() => navigate('/')}>Back to Dashboard</Button>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-xl font-semibold mb-4 text-slate-700"><FaPiggyBank className="mr-3 text-green-500 inline-block" />Savings Accounts</h3>
                        <div className="space-y-4">
                            {savingsAccounts.map(account => (
                                <div key={account.accountId} className="border-t pt-4">
                                    <p className="font-semibold text-slate-800">{account.planName} <span className="font-normal text-slate-500">({account.accountId})</span></p>
                                    <p className="text-2xl font-light text-slate-900">LKR {account.balance.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {isResponsibleAgent && (
                        <>
                            {/* ... Fixed Deposits and Transaction History sections ... */}
                            {/* --- Fixed Deposits Section --- */}
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h3 className="text-xl font-semibold mb-4 text-slate-700"><FaUniversity className="mr-3 text-blue-500 inline-block" />Fixed Deposits</h3>
                                {mockFixedDeposits.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full">
                                            <thead className="text-left text-sm text-slate-500">
                                                <tr>
                                                    {/* 👇 NEW COLUMN HEADER 👇 */}
                                                    <th className="py-2 pr-4 font-medium">Linked Account</th>
                                                    <th className="py-2 px-4 font-medium">Principal</th>
                                                    <th className="py-2 px-4 font-medium">Rate</th>
                                                    <th className="py-2 pl-4 font-medium">Next Payout</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                {mockFixedDeposits.map(fd => (
                                                    <tr key={fd.fdId}>
                                                        {/* 👇 NEW COLUMN DATA 👇 */}
                                                        <td className="py-3 pr-4 text-slate-600 font-medium">{fd.linkedAccountId}</td>
                                                        <td className="py-3 px-4 font-mono">LKR {fd.principal.toLocaleString()}</td>
                                                        <td className="py-3 px-4 text-slate-600">{fd.interestRate}%</td>
                                                        <td className="py-3 pl-4 text-slate-600">{new Date(fd.nextPayoutDate).toLocaleDateString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-slate-500 text-center py-4">No fixed deposits found for this customer.</p>
                                )}
                            </div>

                            {/* --- Transaction History Section --- */}
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h3 className="text-xl font-semibold mb-4 text-slate-700">Transaction History</h3>
                                {mockTransactions.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full">
                                            <thead className="text-left text-sm text-slate-500 bg-slate-50">
                                                <tr>
                                                    <th className="p-3 font-medium">Date</th>
                                                    {/* 👇 NEW COLUMN HEADER 👇 */}
                                                    <th className="p-3 font-medium">Account</th>
                                                    <th className="p-3 font-medium">Type</th>
                                                    <th className="p-3 font-medium text-right">Amount (LKR)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                {mockTransactions.map(t => (
                                                    <tr key={t.transactionId}>
                                                        <td className="p-3 text-slate-600">{new Date(t.timestamp).toLocaleString()}</td>
                                                        {/* 👇 NEW COLUMN DATA 👇 */}
                                                        <td className="p-3 text-slate-600 font-medium">{t.accountId}</td>
                                                        <td className="p-3">
                                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${t.type === 'Deposit' || t.type === 'InterestCredit'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {t.type}
                                                            </span>
                                                        </td>
                                                        <td className={`p-3 font-mono text-right font-semibold ${t.type === 'Deposit' || t.type === 'InterestCredit'
                                                                ? 'text-green-600'
                                                                : 'text-red-600'
                                                            }`}>
                                                            {t.type === 'Withdrawal' ? '-' : '+'} {t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-slate-500 text-center py-4">No transactions found for this customer.</p>
                                )}
                            </div>

                        </>
                    )}
                </div>

                <aside className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-xl font-semibold mb-4 text-slate-700">Actions</h3>
                        <div className="flex flex-col space-y-3">
                            {/* UPDATED: Buttons now navigate to separate pages. */}
                            {/* Note: These links will not know which account to use. Your separate pages will need an account selector dropdown. */}
                            {agent?.permissions.includes('CAN_PROCESS_TRANSACTION') && <Button to={`/customer/${customerId}/transaction`} variant="secondary">Deposit / Withdraw</Button>}
                            {agent?.permissions.includes('CAN_PROCESS_TRANSACTION') && <Button to={`/customer/${customerId}/transfer`} variant="secondary">Transfer Funds</Button>}
                            {agent?.permissions.includes('CAN_CREATE_FD') && <Button to={`/customer/${customerId}/create-fd`}>Open Fixed Deposit</Button>}
                        </div>
                    </div>
                    {isResponsibleAgent && (
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                             <h3 className="text-xl font-semibold mb-4 text-slate-700">Generate Reports</h3>
                             <div className="flex flex-col space-y-3">
                                <Button onClick={() => toast.success('Generating report...')} variant="secondary"><FaFilePdf className="mr-2"/>Daily Transactions</Button>
                                <Button onClick={() => toast.success('Generating report...')} variant="secondary"><FaFilePdf className="mr-2"/>Monthly Summary</Button>
                             </div>
                         </div>

                    )}
                </aside>
            </main>
        </div>
    );
};

export default CustomerDetailPage;