import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowUpToLine } from 'lucide-react';
import { useDepositOperations } from '../../features/transactions/useDepositOperations';
import AccountNumberInput from '../../components/forms/AccountNumberInput';
import AccountDetailsDisplay from '../../components/account/AccountDetailsDisplay';
import AmountInput from '../../components/forms/AmountInput';
import DescriptionInput from '../../components/forms/DescriptionInput';
import Alert from '../../components/common/Alert';
import TransactionResultDisplay from '../../components/common/TransactionResultDisplay';
import SubmitButton from '../../components/common/SubmitButton';
import ConfirmationModal from '../../components/common/ConfirmationModal';

interface DepositFormProps {
  onSuccess?: () => void;
}

const DepositForm = ({ onSuccess }: DepositFormProps) => {
  const [accountNo, setAccountNo] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const {
    accountDetails,
    isLoadingAccount,
    isSubmitting,
    error,
    success,
    transactionResult,
    fetchAccountDetails,
    clearAccountDetails,
    checkAuthToken,
    submitDeposit,
  } = useDepositOperations();

  const handleAccountNoChange = (value: string) => {
    setAccountNo(value);
    if (accountDetails) {
      clearAccountDetails(); // Clear details when account number changes
    }
  };

  const handleFetchDetails = () => {
    fetchAccountDetails(accountNo);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!accountDetails) {
      return;
    }

    setPendingDeposit({
      amount: parseFloat(amount),
      description,
      account_no: parseInt(accountNo, 10),
    });
  };

  const [pendingDeposit, setPendingDeposit] = useState<null | { amount: number; description: string; account_no: number }>(null);

  const confirmDeposit = async () => {
    if (!pendingDeposit) return;
    const success = await submitDeposit(pendingDeposit);
    if (success) {
      setAmount('');
      setDescription('');
      setPendingDeposit(null);
      if (onSuccess) onSuccess();
    }
  };

  const cancelDeposit = () => setPendingDeposit(null);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-borderLight p-8 animate-slide-in-right">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-borderLight">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl flex items-center justify-center">
          <ArrowUpToLine className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-primary">Deposit</h3>
          <p className="text-sm text-textSecondary">Deposit funds to an account</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AccountNumberInput
          accountNo={accountNo}
          onAccountNoChange={handleAccountNoChange}
          onFetchDetails={handleFetchDetails}
          isLoading={isLoadingAccount}
          onDebugAuth={checkAuthToken}
        />

        {/* Account Details Display */}
        {accountDetails && (
          <AccountDetailsDisplay accountDetails={accountDetails} />
        )}

        {/* Amount and Description fields - only show if account details are loaded */}
        {accountDetails && (
          <>
            <AmountInput
              amount={amount}
              onChange={setAmount}
              maxAmount={999999999} // No upper limit for deposits
              label="Deposit Amount"
              placeholder="Enter amount to deposit"
            />

            <DescriptionInput
              description={description}
              onChange={setDescription}
              placeholder="Enter deposit description"
            />
          </>
        )}

        {/* Show helper message when no account details */}
        {!accountDetails && !isLoadingAccount && (
          <Alert type="info">
            <p className="text-sm">
              Please enter an account number and click "Fetch Details" to view account information and proceed with deposit.
            </p>
          </Alert>
        )}

        {error && (
          <Alert type="error">
            {error}
          </Alert>
        )}

        {success && transactionResult && (
          <TransactionResultDisplay result={transactionResult} />
        )}

        <SubmitButton
          isSubmitting={isSubmitting}
          disabled={!accountDetails}
          loadingText="Processing Deposit..."
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-green-600/30"
        >
          Deposit Funds
        </SubmitButton>
      </form>
      <ConfirmationModal
        open={!!pendingDeposit}
        title="Confirm Deposit"
        details={pendingDeposit ? [
          { label: 'Account No', value: pendingDeposit.account_no },
          { label: 'Amount', value: pendingDeposit.amount.toFixed(2) },
          { label: 'Description', value: pendingDeposit.description },
        ] : []}
        onConfirm={confirmDeposit}
        onCancel={cancelDeposit}
        isLoading={isSubmitting}
        confirmText="Confirm Deposit"
        cancelText="Edit"
      />
    </div>
  );
};

export default DepositForm;
