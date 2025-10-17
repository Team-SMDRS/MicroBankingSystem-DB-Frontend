import { useState } from 'react';
import { savingsPlanApi } from '../../api/savingsPlans';
import SubmitButton from '../../components/common/SubmitButton';
import Alert from '../../components/common/Alert';

// Define a type for our form data with string values
interface SavingsPlanFormData {
  plan_name: string;
  interest_rate: string;
  minimum_balance: string;
}

interface CreateSavingsPlanFormProps {
  onSuccess?: (savingsPlanId: string) => void;
}

const CreateSavingsPlanForm: React.FC<CreateSavingsPlanFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<SavingsPlanFormData>({
    plan_name: '',
    interest_rate: '',
    minimum_balance: ''
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
    
    const minBalance = parseFloat(formData.minimum_balance);
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
        minimum_balance: parseFloat(formData.minimum_balance)
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
          minimum_balance: ''
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
    <div className="bg-[#FFFFFF] rounded-2xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-[#1D3557] mb-4">Create New Savings Plan</h3>
      
      {error && (
        <Alert type="error" className="mb-6">
          <div className="flex justify-between items-center">
            <div>{error}</div>
            <button 
              className="ml-2 text-[#E63946] hover:text-red-800 transition-colors" 
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
              className="ml-2 text-[#2ECC71] hover:text-green-800 transition-colors" 
              onClick={() => setSuccess(null)}
            >
              ×
            </button>
          </div>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="plan_name" className="block text-sm font-medium text-[#6C757D] mb-2">
            Plan Name
          </label>
          <input
            type="text"
            id="plan_name"
            name="plan_name"
            value={formData.plan_name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F]"
            required
          />
        </div>
        
        <div>
          <label htmlFor="interest_rate" className="block text-sm font-medium text-[#6C757D] mb-2">
            Interest Rate (%)
          </label>
          <input
            type="number"
            id="interest_rate"
            name="interest_rate"
            value={formData.interest_rate}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F]"
            step="0.01"
            min="0"
            required
          />
        </div>
        
        <div>
          <label htmlFor="minimum_balance" className="block text-sm font-medium text-[#6C757D] mb-2">
            Minimum Balance
          </label>
          <input
            type="number"
            id="minimum_balance"
            name="minimum_balance"
            value={formData.minimum_balance}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F]"
            step="0.01"
            min="0"
            required
          />
        </div>
        
        <div className="pt-4">
          <SubmitButton 
            isSubmitting={isSubmitting}
            className="bg-[#38B000] hover:bg-green-700 text-white font-semibold rounded-xl px-5 py-2 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
          >
            Create Savings Plan
          </SubmitButton>
        </div>
      </form>
    </div>
  );
};

export default CreateSavingsPlanForm;