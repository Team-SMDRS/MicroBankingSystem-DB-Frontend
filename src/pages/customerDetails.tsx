import React from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaUserCircle, FaPiggyBank, FaUniversity, FaFilePdf } from 'react-icons/fa';

// CORRECTED: Import paths and casing are fixed
import { useAuth } from '../store/authContex';
import { mockCustomers, mockSavingsAccounts, mockFixedDeposits, mockTransactions } from '../api/testData';
import Button from '../components/ui/button';
import type { SavingsAccount, Customer } from '../types';

// ===================================================================================
// A Reusable component for displaying the list of accounts
// The action buttons that link to your separate pages are now here.
// ===================================================================================
const AccountList: React.FC<{ savingsAccounts: SavingsAccount[] }> = ({ savingsAccounts }) => {
    const { agent } = useAuth();
    const { customerId } = useParams<{ customerId: string }>();

    if (savingsAccounts.length === 0) {
        return <p className="text-gray-500">No savings accounts found for this customer.</p>;
    }

    return (
        <div className="space-y-4">
            {savingsAccounts.map(account => (
                <div key={account.accountId} className="border-t pt-4 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                    <div className="flex items-center space-x-3 w-full">
                        <FaPiggyBank className="text-green-500 flex-shrink-0" size={24} />
                        <div>
                            <p className="font-semibold text-slate-800">{account.planName} <span className="font-normal text-slate-500">({account.accountId})</span></p>
                            <p className="text-2xl font-light text-slate-900">LKR {account.balance.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex flex-shrink-0 space-x-2 w-full md:w-auto">
                        {agent?.permissions.includes('CAN_PROCESS_TRANSACTION') && (
                            <Button to={`/customer/${customerId}/transaction/${account.accountId}`} variant="secondary" className="w-full justify-center">Deposit/Withdraw</Button>
                        )}
                        {agent?.permissions.includes('CAN_PROCESS_TRANSACTION') && (
                            <Button to={`/customer/${customerId}/transfer/${account.accountId}`} variant="secondary" className="w-full justify-center">Transfer</Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};


// ===================================================================================
// The Main, Unified Customer Detail Page
// ===================================================================================
const CustomerDetailPage: React.FC = () => {
    const { customerId } = useParams<{ customerId: string }>();
    const { agent } = useAuth();
    const navigate = useNavigate();
    
    const customer = mockCustomers.find(c => c.customerId === customerId);

    if (!customer) {
        return <div className="p-8 text-center text-red-500">Customer not found!</div>;
    }
    
    const isResponsibleAgent = agent?.agentId === customer.assignedAgentId;

    const savingsAccounts = mockSavingsAccounts.filter(acc => acc.customerId === customerId);
    const accountIds = savingsAccounts.map(acc => acc.accountId);
    const fixedDeposits = mockFixedDeposits.filter(fd => accountIds.includes(fd.linkedAccountId));
    const transactions = mockTransactions.filter(t => accountIds.includes(t.accountId)).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <div className="bg-slate-50 min-h-screen p-8">
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
                        <h3 className="text-xl font-semibold mb-4 text-slate-700"><FaPiggyBank className="mr-3 text-green-500 inline-block"/>Savings Accounts</h3>
                        <AccountList savingsAccounts={savingsAccounts} />
                    </div>

                    {isResponsibleAgent && (
                        <>
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                {/* Fixed Deposits Table Here */}
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                {/* Transaction History Table Here */}
                            </div>
                        </>
                    )}
                </div>

                <aside className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-xl font-semibold mb-4 text-slate-700">Customer Actions</h3>
                        <div className="flex flex-col space-y-3">
                            {agent?.permissions.includes('CAN_CREATE_FD') && <Button to={`/customer/${customerId}/create-fd`}>Open Fixed Deposit</Button>}
                        </div>
                    </div>
                    {isResponsibleAgent && (
                         <div className="bg-white p-6 rounded-xl shadow-sm">
                             <h3 className="text-xl font-semibold mb-4 text-slate-700">Generate Reports</h3>
                             {/* Report Buttons Here */}
                         </div>
                    )}
                </aside>
            </main>
        </div>
    );
};

export default CustomerDetailPage;