import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({});
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newAddress, setNewAddress] = useState(""); // To handle the new address input

  useEffect(() => {
    if (!user) return;

    axios.get(`http://localhost:5000/api/profile/${user.id}`)
      .then(res => {
        setForm(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching profile:', err);
      });
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAddNewAddress = () => {
    if (newAddress.trim()) {
      // Send new address to the backend
      axios.post(`/api/profile/addresses/${user.id}`, { address: newAddress })
        .then(() => {
          setForm(prev => ({
            ...prev,
            addresses: [...(prev.addresses || []), { address: newAddress, isPrimary: false }],
          }));
          setNewAddress(""); // Clear the new address input field
        })
        .catch(err => console.error('Error adding new address', err));
    }
  };

  const handleSetPrimaryAddress = (addressId) => {
    axios.put(`/api/profile/addresses/${user.id}/${addressId}/primary`)
      .then(() => {
        const updatedAddresses = form.addresses.map(addr =>
          addr.id === addressId ? { ...addr, isPrimary: true } : { ...addr, isPrimary: false }
        );
        setForm({ ...form, addresses: updatedAddresses });
      })
      .catch(err => console.error('Error setting primary address', err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    if (image) formData.append('profileImage', image);

    // Send updated profile information to the backend
    await axios.post(`/api/profile/update/${user.id}`, formData);
    alert('✅ Profile updated!');
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="container mt-4 pt-5">
      <h3>User Profile</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input name="name" value={form.name || ''} onChange={handleChange} />
        </div>

        <div>
          <label>Email:</label>
          <input value={form.email} disabled />
        </div>

        <div>
          <label>Address:</label>
          <textarea name="address" value={form.address || ''} onChange={handleChange} />
        </div>

        {/* Add New Address Button */}
        <button type="button" onClick={handleAddNewAddress}>
          Add New Address
        </button>

        {/* New Address Input */}
        {newAddress && (
          <div>
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Enter new address"
            />
          </div>
        )}

        {/* Display Added Addresses */}
        <div>
          <h5>Added Addresses</h5>
          {form.addresses && form.addresses.map((address, index) => (
            <div key={index}>
              <div>{address.address}</div>
              <label>
                <input
                  type="radio"
                  checked={address.isPrimary}
                  onChange={() => handleSetPrimaryAddress(address.id)}
                />
                Set as Primary Address
              </label>
            </div>
          ))}
        </div>

        <div>
          <label>Profile Image:</label>
          <input type="file" onChange={handleImage} />
          {form.profile_image && (
            <img src={`/uploads/${form.profile_image}`} alt="Profile" width={100} />
          )}
        </div>

        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default Profile;
