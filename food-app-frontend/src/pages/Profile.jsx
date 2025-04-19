import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({});
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newAddress, setNewAddress] = useState({
    full_name: '',
    phone: '',
    country: 'India',
    state: '',
    city: '',
    zip: '',
    address: '',
    is_primary: false
  });
  const [showNewAddressInput, setShowNewAddressInput] = useState(false);

  useEffect(() => {
    if (!user) return;

    axios.get(`http://localhost:5000/api/profile/${user.id}`)
      .then(res => {
        const userData = res.data;

        if (userData.addresses && userData.addresses.length > 0 && userData.orderCount > 0) {
          userData.addresses = userData.addresses.map((a, i) =>
            i === 0 ? { ...a, isPrimary: true } : a
          );
        }

        setForm(userData);
        setLoading(false);
      })
      .catch(err => console.error('Error fetching profile:', err));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isEditing) {
      setForm(prev => ({ ...prev, [name]: value }));
    } else {
      setNewAddress(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImage = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    if (image) formData.append('profileImage', image);

    await axios.post(`/api/profile/update/${user.id}`, formData);
    alert('✅ Profile updated!');
    setIsEditing(false);
  };

  const handleAddNewAddress = () => {
    if (
      newAddress.full_name &&
      newAddress.phone &&
      newAddress.state &&
      newAddress.city &&
      newAddress.zip &&
      newAddress.address
    ) {
      const isPrimary = form.addresses?.length === 0;
      axios.post(`http://localhost:5000/api/profile/add-address/${user.id}`, newAddress)
        .then(() => {
          setForm(prev => ({
            ...prev,
            addresses: [...(prev.addresses || []), { ...newAddress, isPrimary }],
          }));
          setNewAddress({
            full_name: '',
            phone: '',
            country: 'India',
            state: '',
            city: '',
            zip: '',
            address: '',
            is_primary: false
          });
          setShowNewAddressInput(false);
        })
        .catch(err => console.error('Error adding new address', err));
    } else {
      alert("Please fill all address fields.");
    }
  };

  const handleSetPrimaryAddress = (addressId) => {
    axios.put(`/api/profile/add-address/${user.id}/${addressId}/primary`)
      .then(() => {
        const updatedAddresses = form.addresses.map(addr =>
          addr.id === addressId ? { ...addr, isPrimary: true } : { ...addr, isPrimary: false }
        );
        setForm({ ...form, addresses: updatedAddresses });
      })
      .catch(err => console.error('Error setting primary address', err));
  };

  if (loading) return <p>Loading profile...</p>;

  const primaryAddress = form.addresses?.find(addr => addr.isPrimary);

  return (
    <div className="container mt-4 pt-5">
      <h3>User Profile</h3>

      {!isEditing ? (
        <div>
          <p><strong>Name:</strong> {form.name}</p>
          <p><strong>Phone:</strong> {form.phone || '-'}</p>
          <p><strong>Email:</strong> {form.email}</p>

          {primaryAddress && (
            <div>
              <h5>Primary Address</h5>
              <p>{primaryAddress.full_name}</p>
              <p>{primaryAddress.phone}</p>
              <p>{primaryAddress.address}</p>
              <p>{primaryAddress.city}, {primaryAddress.state}, {primaryAddress.zip}, {primaryAddress.country}</p>
            </div>
          )}

          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input name="name" value={form.name || ''} onChange={handleChange} />
          </div>
          <div>
            <label>Phone:</label>
            <input name="phone" value={form.phone || ''} onChange={handleChange} />
          </div>
          <div>
            <label>Email:</label>
            <input value={form.email} disabled />
          </div>
          <div>
            <label>Profile Image:</label>
            <input type="file" onChange={handleImage} />
            {form.profile_image && <img src={`/uploads/${form.profile_image}`} alt="Profile" width={100} />}
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      )}

      {/* Add Address Section */}
      <hr />
      <h5>Manage Addresses</h5>
      <button type="button" onClick={() => setShowNewAddressInput(prev => !prev)}>
        {showNewAddressInput ? 'Cancel' : 'Add New Address'}
      </button>

      {showNewAddressInput && (
        <div className="mt-3">
          <input name="full_name" value={newAddress.full_name} onChange={handleChange} placeholder="Full Name" />
          <input name="phone" value={newAddress.phone} onChange={handleChange} placeholder="Phone" />
          <input name="country" value={newAddress.country} onChange={handleChange} placeholder="Country" />
          <input name="state" value={newAddress.state} onChange={handleChange} placeholder="State" />
          <input name="city" value={newAddress.city} onChange={handleChange} placeholder="City" />
          <input name="zip" value={newAddress.zip} onChange={handleChange} placeholder="Zip" />
          <textarea name="address" value={newAddress.address} onChange={handleChange} placeholder="Street Address"></textarea>
          <label>
            <input
              type="checkbox"
              name="is_primary"
              checked={newAddress.is_primary}
              onChange={(e) => setNewAddress({ ...newAddress, is_primary: e.target.checked })}
            />
            Set as Primary
          </label>
          <button onClick={handleAddNewAddress}>Save Address</button>
        </div>
      )}

      {/* Display All Addresses */}
      {form.addresses && form.addresses.length > 0 && (
        <div className="mt-4">
          <h6>Saved Addresses</h6>
          {form.addresses.map(addr => (
            <div key={addr.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <p>{addr.full_name} | {addr.phone}</p>
              <p>{addr.address}</p>
              <p>{addr.city}, {addr.state}, {addr.zip}, {addr.country}</p>
              <label>
                <input
                  type="radio"
                  name="primaryAddress"
                  checked={addr.isPrimary}
                  onChange={() => handleSetPrimaryAddress(addr.id)}
                />
                Set as Primary
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
