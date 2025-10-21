import React, { useState } from "react";
import { fetchCustomerDetailsById, updateCustomer } from "../../api/customers";
import type { CustomerDetails } from "../../api/customers";

interface UpdateCustomerFormProps {
  customerId: string;
  onClose: () => void;
}

const UpdateCustomerForm: React.FC<UpdateCustomerFormProps> = ({ customerId, onClose }) => {
  const [details, setDetails] = useState<CustomerDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    address: "",
    phone_number: "",
    nic: ""
  });
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading(true);
      try {
        const data = await fetchCustomerDetailsById(customerId);
        setDetails(data);
        setForm({
          full_name: data.full_name || "",
          address: data.address || "",
          phone_number: data.phone_number || "",
          nic: data.nic || ""
        });
      } catch (error) {
        setError("Error fetching customer details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [customerId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      // Only send updatable fields (excluding nic)
      const updateData = {
        full_name: form.full_name,
        address: form.address,
        phone_number: form.phone_number
      };
      await updateCustomer(customerId, updateData);
      setSuccess(true);
    } catch (error) {
      setError("Error updating customer.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!details) return null;

  return (
    <div className="w-full max-w-screen-xl mx-auto flex justify-center items-center min-h-[60vh]">
      <div className="bg-white rounded-2xl shadow-md border border-borderLight p-8 w-full animate-slide-in-right">
        <h2 className="text-2xl font-bold mb-6 text-primary text-center">Update Customer Details</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label-text" htmlFor="full_name">Full Name</label>
            <input id="full_name" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Full Name" className="input-field w-full" />
          </div>
          <div>
            <label className="label-text" htmlFor="address">Address</label>
            <input id="address" name="address" value={form.address} onChange={handleChange} placeholder="Address" className="input-field w-full" />
          </div>
          <div>
            <label className="label-text" htmlFor="phone_number">Phone Number</label>
            <input id="phone_number" name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="Phone Number" className="input-field w-full" />
          </div>
          <div>
            <label className="label-text" htmlFor="nic">NIC</label>
            <input id="nic" name="nic" value={form.nic} readOnly placeholder="NIC" className="input-field w-full bg-background text-textSecondary cursor-not-allowed" />
          </div>
          <div className="col-span-1 md:col-span-2 flex justify-center gap-4 mt-4">
            <button type="submit" className="button-primary">Update</button>
            <button type="button" className="button-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
        {success && <div className="text-emerald-700 mt-6 text-center font-semibold bg-emerald-50 border border-emerald-200 rounded-xl p-3">Customer updated successfully!</div>}
      </div>
    </div>
  );
};

export default UpdateCustomerForm;
