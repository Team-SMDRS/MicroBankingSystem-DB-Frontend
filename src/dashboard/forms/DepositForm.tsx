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

    const success = await submitDeposit({
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
    <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-[#2A9D8F]">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#E9ECEF]">
        <div className="w-12 h-12 bg-[#38B000] bg-opacity-10 rounded-lg flex items-center justify-center">
          <ArrowUpToLine className="w-6 h-6 text-[#38B000]" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-[#264653]">Deposit</h3>
          <p className="text-sm text-[#6C757D]">Deposit funds to an account</p>
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
        >
          Deposit Funds
        </SubmitButton>
      </form>
    </div>
  );
};

export default DepositForm;
