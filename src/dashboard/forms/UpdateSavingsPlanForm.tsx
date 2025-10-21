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
    <div className="bg-white rounded-2xl shadow-md border border-borderLight p-8 animate-slide-in-right">
      <h3 className="text-2xl font-bold text-primary mb-2">Update Savings Plan Interest Rate</h3>
      <p className="text-sm text-textSecondary mb-6">Modify the interest rate for this savings plan</p>
      
      {error && (
        <Alert type="error" className="mb-4">
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
        <Alert type="success" className="mb-4">
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
      <div className="bg-background p-4 rounded-2xl mb-6 border border-borderLight">
        <h4 className="text-lg font-semibold text-primary mb-4">Plan Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-textSecondary">Plan ID</p>
            <p className="font-semibold text-primary">{plan.savings_plan_id}</p>
          </div>
          <div>
            <p className="text-sm text-textSecondary">Plan Name</p>
            <p className="font-semibold text-primary">{plan.plan_name}</p>
          </div>
          <div>
            <p className="text-sm text-textSecondary">Minimum Balance</p>
            <p className="font-semibold text-primary">Rs. {plan.minimum_balance.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="interest_rate" className="label-text">
            Interest Rate (%)
          </label>
          <input
            type="number"
            id="interest_rate"
            name="interest_rate"
            value={interestRate}
            onChange={handleInputChange}
            className="input-field w-full"
            step="0.01"
            min="0"
            required
          />
          <p className="text-xs text-tertiary mt-1">
            Current rate: {plan.interest_rate}% - Enter new rate to update
          </p>
        </div>
        
        <div className="flex space-x-4 pt-2">
          <SubmitButton 
            isSubmitting={isSubmitting} 
          >
            Update Interest Rate
          </SubmitButton>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
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