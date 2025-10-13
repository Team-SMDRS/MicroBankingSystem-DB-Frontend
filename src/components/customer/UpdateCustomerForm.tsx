import React, { useState } from "react";

interface UpdateCustomerFormProps {
  customerId: string;
  token: string;
  onClose: () => void;
}

const API_BASE = "http://127.0.0.1:8000/api/account-management/customer/";

const UpdateCustomerForm: React.FC<UpdateCustomerFormProps> = ({ customerId, token, onClose }) => {
  const [details, setDetails] = useState<any>(null);
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
    setLoading(true);
    fetch(`${API_BASE}${customerId}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setDetails(data);
        setForm({
          full_name: data.full_name || "",
          address: data.address || "",
          phone_number: data.phone_number || "",
          nic: data.nic || ""
        });
      })
      .catch(() => setError("Error fetching customer details."))
      .finally(() => setLoading(false));
  }, [customerId, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch(`${API_BASE}${customerId}`, {
        method: "PUT",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Update failed");
      setSuccess(true);
    } catch {
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
      <div className="bg-white shadow-xl rounded-xl p-8 w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Update Customer Details</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="full_name">Full Name</label>
            <input id="full_name" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Full Name" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="address">Address</label>
            <input id="address" name="address" value={form.address} onChange={handleChange} placeholder="Address" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="phone_number">Phone Number</label>
            <input id="phone_number" name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="Phone Number" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="nic">NIC</label>
            <input id="nic" name="nic" value={form.nic} onChange={handleChange} placeholder="NIC" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="col-span-1 md:col-span-2 flex justify-center gap-4 mt-4">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow transition">Update</button>
            <button type="button" className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-lg border shadow" onClick={onClose}>Cancel</button>
          </div>
        </form>
        {success && <div className="text-green-600 mt-6 text-center font-semibold">Customer updated successfully!</div>}
      </div>
    </div>
  );
};

export default UpdateCustomerForm;
