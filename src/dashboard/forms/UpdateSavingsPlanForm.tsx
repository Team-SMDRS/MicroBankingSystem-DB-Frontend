import { useState } from 'react';
import { savingsPlanApi } from '../../api/savingsPlans';
import type { SavingsPlan } from '../../api/savingsPlans';
import SubmitButton from '../../components/common/SubmitButton';
import Alert from '../../components/common/Alert';

interface UpdateSavingsPlanFormProps {
  plan: SavingsPlan;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const UpdateSavingsPlanForm: React.FC<UpdateSavingsPlanFormProps> = ({ 
  plan, 
  onSuccess, 
  onCancel 
}) => {
  const [interestRate, setInterestRate] = useState(plan.interest_rate.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterestRate(e.target.value);
  };

  const validateForm = (): boolean => {
    const rate = parseFloat(interestRate);
    if (isNaN(rate) || rate <= 0) {
      setError('Interest rate must be greater than 0');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Convert string value to number for API call
      const newRate = parseFloat(interestRate);
      
      // Call the API to update the savings plan interest rate
      const response = await savingsPlanApi.updateSavingsPlanInterestRate(
        plan.savings_plan_id,
        newRate
      );
      
      if (response && response.success) {
        // Set success message
        setSuccess(`Interest rate updated successfully to ${newRate}%!`);
        
        // Call onSuccess if provided after a short delay
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          }
        }, 2000);
      } else {
        setError('Failed to update interest rate. Please try again.');
      }
    } catch (err: any) {
      // Fall back to general error handling
      const errorMessage = err.response?.data?.detail || 
        err.message || 
        'An error occurred while updating the interest rate';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-[#2A9D8F]">
      <h3 className="text-xl font-semibold text-[#264653] mb-6">Update Savings Plan Interest Rate</h3>
      
      {error && (
        <Alert type="error" className="mb-6">
          <div className="flex justify-between items-center">
            <div>{error}</div>
            <button 
              className="ml-2 text-red-700 hover:text-red-900" 
              onClick={() => setError(null)}
            >
              ×
            </button>
          </div>
        </Alert>
      )}
      
      {success && (
        <Alert type="success" className="mb-6">
          <div className="flex justify-between items-center">
            <div>{success}</div>
            <button 
              className="ml-2 text-emerald-700 hover:text-emerald-900" 
              onClick={() => setSuccess(null)}
            >
              ×
            </button>
          </div>
        </Alert>
      )}
      
      {/* Display plan details */}
      <div className="bg-[#F8F9FA] p-5 rounded-lg mb-8 border border-[#E9ECEF]">
        <h4 className="text-md font-semibold mb-4 text-[#264653]">Plan Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-[#6C757D]">Plan ID</p>
            <p className="font-medium text-[#264653]">{plan.savings_plan_id}</p>
          </div>
          <div>
            <p className="text-sm text-[#6C757D]">Plan Name</p>
            <p className="font-medium text-[#264653]">{plan.plan_name}</p>
          </div>
          <div>
            <p className="text-sm text-[#6C757D]">Minimum Balance</p>
            <p className="font-medium text-[#264653]">${plan.minimum_balance.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="interest_rate" className="block text-sm font-medium text-[#6C757D] mb-2">
            Interest Rate (%)
          </label>
          <input
            type="number"
            id="interest_rate"
            name="interest_rate"
            value={interestRate}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F]"
            step="0.01"
            min="0"
            required
          />
          <p className="text-xs text-[#6C757D] mt-2">
            Current rate: {plan.interest_rate}% - Enter new rate to update
          </p>
        </div>
        
        <div className="flex space-x-4 pt-4">
          <SubmitButton 
            isSubmitting={isSubmitting}
            className="bg-[#38B000] hover:bg-green-700 text-white font-semibold rounded-xl px-5 py-2 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
          >
            Update Interest Rate
          </SubmitButton>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-[#6C757D] rounded-xl font-medium transition-all duration-200 hover:shadow-md transform hover:-translate-y-1 border border-[#E9ECEF]"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UpdateSavingsPlanForm;