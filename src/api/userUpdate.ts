// Direct API function for updating a user - Created October 17, 2025
import api from './axios';

/**
 * Function to update a user's details
 * Use this function instead of making direct API calls to ensure consistency
 */
export const updateUserDetails = async (userData: {
  user_id: string;
  first_name: string;
  last_name: string;
  address?: string | null;
  phone_number?: string | null;
  email?: string | null;
}) => {
  console.log('⚠️ Using dedicated updateUserDetails function - Oct 17, 2025');
  // Using PUT method to the correct endpoint as shown in curl example
  return api.put('/api/auth/user/update_details', userData);
};