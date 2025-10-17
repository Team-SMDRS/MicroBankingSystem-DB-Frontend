// Updated on October 17, 2025 - Fixed API endpoint for user updates
import React, { useState } from 'react';
// Removed unused api import
import { updateUserDetails } from '../../api/userUpdate';
import SubmitButton from '../../components/common/SubmitButton';
import Alert from '../../components/common/Alert';

interface Role {
  role_id: string;
  role_name: string;
}

interface User {
  user_id: string;
  nic: string | null;
  first_name: string;
  last_name: string;
  address: string | null;
  phone_number: string | null;
  dob: string | null;
  email: string | null;
  created_at: string;
  roles: Role[];
}

interface UpdateUserFormProps {
  user: User | null;
  onUpdateSuccess?: () => void;
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({ user, onUpdateSuccess }) => {
  const [formData, setFormData] = useState<Partial<User>>(
    user ? {
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      nic: user.nic || '',
      address: user.address || '',
      phone_number: user.phone_number || '',
      dob: user.dob || '',
      email: user.email || '',
    } : {}
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Update form data when user prop changes
  React.useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        nic: user.nic || '',
        address: user.address || '',
        phone_number: user.phone_number || '',
        dob: user.dob ? user.dob.split('T')[0] : '', // Format date to YYYY-MM-DD for date input
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // UPDATED WITH CORRECT ENDPOINT - October 17, 2025
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission
    e.preventDefault();
    
    // Add a very distinct log message to confirm this code is running
    console.log('🔴 UPDATED FIX RUNNING - Using PUT to /api/auth/user/update_details - Oct 17, 2025 🔴');
    
    if (!user?.user_id) {
      setError('No user selected for update');
      return;
    }

    // Standard loading state management
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Create data object with only the fields that can be updated
      // Ensure all required fields have non-undefined values
      const updateData = {
        user_id: user.user_id,
        first_name: formData.first_name || user.first_name,
        last_name: formData.last_name || user.last_name,
        address: formData.address,
        phone_number: formData.phone_number,
        email: formData.email
      };

      // Log the payload for debugging
      console.log('🔵 Submitting user update with data:', updateData);

      // Using our dedicated function to ensure correct API endpoint
      // This function now uses PUT to the correct endpoint
      const response = await updateUserDetails(updateData);
      
      // Log success response
      console.log('✅ Update successful:', response);
      setSuccess('User details updated successfully');
      
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (err: any) {
      // Enhanced error logging
      console.error('❌ Update failed with error:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.detail || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="p-4 text-center text-gray-500">No user selected</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Update User Details</h3>
        <p className="text-sm text-gray-500">Editing information for {user.first_name} {user.last_name}</p>
        <p className="text-xs text-blue-600 mt-1">You can edit the first name, last name, address, phone number, and email</p>
      </div>

      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NIC Number
            </label>
            <input
              type="text"
              name="nic"
              value={formData.nic || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-200 bg-gray-100 rounded-md shadow-sm text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">NIC number cannot be modified</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-200 bg-gray-100 rounded-md shadow-sm text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">Date of birth cannot be modified</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="pt-2">
          <SubmitButton isSubmitting={loading} disabled={loading}>
            Update User
          </SubmitButton>
        </div>
      </form>
    </div>
  );
};

export default UpdateUserForm;