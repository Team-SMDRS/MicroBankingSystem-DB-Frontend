import { useState } from 'react';
import { savingsPlanApi } from '../../api/savingsPlans';
import type { SavingsPlanCreateRequest } from '../../api/savingsPlans';
import SubmitButton from '../../components/common/SubmitButton';
import Alert from '../../components/common/Alert';

// Define a type for our form data with string values
interface SavingsPlanFormData {
  plan_name: string;
  interest_rate: string;
  min_balance: string;
}

interface CreateSavingsPlanFormProps {
  onSuccess?: (savingsPlanId: string) => void;
}

const CreateSavingsPlanForm: React.FC<CreateSavingsPlanFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<SavingsPlanFormData>({
    plan_name: '',
    interest_rate: '',
    min_balance: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = (): boolean => {
    if (!formData.plan_name.trim()) {
      setError('Plan name is required');
      return false;
    }
    
    const interestRate = parseFloat(formData.interest_rate);
    if (isNaN(interestRate) || interestRate <= 0) {
      setError('Interest rate must be greater than 0');
      return false;
    }
    
    const minBalance = parseFloat(formData.min_balance);
    if (isNaN(minBalance) || minBalance < 0) {
      setError('Minimum balance cannot be negative');
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
      // Convert string values to numbers for API call
      const apiData = {
        plan_name: formData.plan_name,
        interest_rate: parseFloat(formData.interest_rate),
        min_balance: parseFloat(formData.min_balance)
      };
      
      // Store original plan name before resetting form
      const planName = formData.plan_name;
      
      const response = await savingsPlanApi.createSavingsPlan(apiData);
      
      // Only show success and reset if we got a valid response with an ID
      if (response && response.savings_plan_id) {
        setSuccess(`Savings plan "${planName}" created successfully!`);
        
        // Reset form
        setFormData({
          plan_name: '',
          interest_rate: '',
          min_balance: ''
        });
        
        // Call onSuccess if provided
        if (onSuccess) {
          onSuccess(response.savings_plan_id);
        }
      } else {
        // No valid response ID
        setError('Failed to create savings plan. Please try again.');
      }
    } catch (err: any) {
      // Check specifically for the duplicate plan name error
      const detail = err.response?.data?.detail || '';
      
      if (detail.includes('savings plan with this name already exists')) {
        setError(`Plan "${formData.plan_name}" already exists. Please use a different name.`);
      } else {
        // Fall back to general error handling
        const errorMessage = detail || 
          err.message || 
          'An error occurred while creating the savings plan';
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">Create New Savings Plan</h3>
      
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
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="plan_name" className="block text-sm font-medium text-gray-700 mb-1">
            Plan Name
          </label>
          <input
            type="text"
            id="plan_name"
            name="plan_name"
            value={formData.plan_name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="interest_rate" className="block text-sm font-medium text-gray-700 mb-1">
            Interest Rate (%)
          </label>
          <input
            type="number"
            id="interest_rate"
            name="interest_rate"
            value={formData.interest_rate}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            step="0.01"
            min="0"
            required
          />
        </div>
        
        <div>
          <label htmlFor="min_balance" className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Balance
          </label>
          <input
            type="number"
            id="min_balance"
            name="min_balance"
            value={formData.min_balance}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            step="0.01"
            min="0"
            required
          />
        </div>
        
        <div className="pt-2">
          <SubmitButton 
            isSubmitting={isSubmitting} 
          >
            Create Savings Plan
          </SubmitButton>
        </div>
      </form>
    </div>
  );
};

export default CreateSavingsPlanForm;