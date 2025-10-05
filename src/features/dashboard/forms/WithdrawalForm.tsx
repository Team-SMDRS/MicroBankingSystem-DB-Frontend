import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowDownToLine } from 'lucide-react';
import { useWithdrawalOperations } from '../../../hooks/useWithdrawalOperations';
import AccountNumberInput from '../../../components/forms/AccountNumberInput';
import AccountDetailsDisplay from '../../../components/account/AccountDetailsDisplay';
import AmountInput from '../../../components/forms/AmountInput';
import DescriptionInput from '../../../components/forms/DescriptionInput';
import Alert from '../../../components/common/Alert';
import TransactionResultDisplay from '../../../components/common/TransactionResultDisplay';
import SubmitButton from '../../../components/common/SubmitButton';

interface WithdrawalFormProps {
  onSuccess?: () => void;
}

const WithdrawalForm = ({ onSuccess }: WithdrawalFormProps) => {
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
    submitWithdrawal,
  } = useWithdrawalOperations();

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

    const success = await submitWithdrawal({
      amount: parseFloat(amount),
      description,
      account_no: parseInt(accountNo),
    });

    if (success) {
      setAmount('');
      setDescription('');
      if (onSuccess) onSuccess();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl flex items-center justify-center">
          <ArrowDownToLine className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Withdrawal</h3>
          <p className="text-sm text-slate-500">Withdraw funds from an account</p>
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
              maxAmount={accountDetails.balance}
            />

            <DescriptionInput
              description={description}
              onChange={setDescription}
            />
          </>
        )}

        {/* Show helper message when no account details */}
        {!accountDetails && !isLoadingAccount && (
          <Alert type="info">
            <p className="text-sm">
              Please enter an account number and click "Fetch Details" to view account information and proceed with withdrawal.
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
          loadingText="Processing Withdrawal..."
        >
          Withdraw Funds
        </SubmitButton>
      </form>
    </div>
  );
};

export default WithdrawalForm;
