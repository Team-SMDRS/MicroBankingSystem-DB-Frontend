import React, { useState } from 'react';
import api from '../../api/axios';
import SubmitButton from '../../components/common/SubmitButton';
import Alert from '../../components/common/Alert';

interface CreateUserRequest {
  nic: string;
  first_name: string;
  last_name: string;
  address: string;
  phone_number: string;
  dob: string;
  username: string;
  password: string;
}

interface CreateUserResponse {
  msg: string;
  user_id: string;
}

const CreateUserForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateUserRequest>({
    nic: '',
    first_name: '',
    last_name: '',
    address: '',
    phone_number: '',
    dob: '',
    username: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset form to ensure no existing user data
  const resetForm = () => {
    setFormData({
      nic: '',
      first_name: '',
      last_name: '',
      address: '',
      phone_number: '',
      dob: '',
      username: '',
      password: '',
    });
  };

  // Clear form when component mounts
  React.useEffect(() => {
    resetForm();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await api.post<CreateUserResponse>('/api/auth/register', formData);
      setSuccess(`User registered successfully! User ID: ${response.data.user_id}`);
      // Reset form to clear all fields
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-8 border border-borderLight animate-slide-in-right">
      <h3 className="text-2xl font-bold text-primary mb-2">Create New User</h3>
      <p className="text-sm text-secondary mb-6">Add a new user to the system.</p>
      
      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label-text">
              NIC Number
            </label>
            <input
              type="text"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              required
              placeholder="e.g., 200211453382"
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="label-text">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="label-text">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="label-text">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="label-text">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
              placeholder="e.g., 0772233194"
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="label-text">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="label-text">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter new username"
              autoComplete="off"
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="label-text">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter new password"
              autoComplete="new-password"
              className="input-field w-full"
            />
          </div>
        </div>

        <div className="pt-4">
          <SubmitButton isSubmitting={loading} disabled={loading}>Create User</SubmitButton>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;