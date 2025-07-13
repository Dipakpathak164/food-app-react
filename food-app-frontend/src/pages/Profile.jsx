import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MdEdit, MdDelete, MdAdd, MdSave, MdCancel } from 'react-icons/md';

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ addresses: [] });
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

    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/profile/${user.id}`)
      .then(res => {
        const userData = res.data;

        // Ensure addresses array exists
        if (!Array.isArray(userData.addresses)) {
          userData.addresses = [];
        }

        // Ensure the first address is marked as primary if no primary exists
        if (userData.addresses.length > 0 && !userData.addresses.some(a => a.is_primary)) {
          userData.addresses[0].is_primary = true;
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

    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/profile/update/${user.id}`, formData);
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
      const isPrimary = form.addresses.length === 0;
      const addressToSend = { ...newAddress, is_primary: isPrimary };

      axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/profile/add-address/${user.id}`, addressToSend)
        .then(() => {
          setForm(prev => ({
            ...prev,
            addresses: [...(prev.addresses || []), addressToSend],
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
    axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/profile/add-address/${user.id}/${addressId}/primary`)
      .then(() => {
        const updatedAddresses = form.addresses.map(addr =>
          addr.id === addressId ? { ...addr, is_primary: true } : { ...addr, is_primary: false }
        );
        setForm({ ...form, addresses: updatedAddresses });
      })
      .catch(err => console.error('Error setting primary address', err));
  };

  const handleEditAddress = (addressId) => {
    const addressToEdit = form.addresses.find(addr => addr.id === addressId);
    setNewAddress(addressToEdit);
    setShowNewAddressInput(true);
  };

  const handleUpdateAddress = () => {
    if (
      newAddress.full_name &&
      newAddress.phone &&
      newAddress.state &&
      newAddress.city &&
      newAddress.zip &&
      newAddress.address
    ) {
      axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/profile/update-address/${user.id}/${newAddress.id}`, newAddress)
        .then(() => {
          const updatedAddresses = form.addresses.map(addr =>
            addr.id === newAddress.id ? { ...newAddress } : addr
          );
          setForm({ ...form, addresses: updatedAddresses });
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
        .catch(err => console.error('Error updating address', err));
    } else {
      alert("Please fill all address fields.");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  const primaryAddress = form.addresses.find(addr => addr.is_primary);

  return (
    <>
      <section className='py-5 bg-white'>
        <div className="container mt-4 pt-5">
          <div className="row">
            <div className="col-md-6">
              <h3 className='mb-3'>User Profile</h3>
              {!isEditing ? (
                <div className='border p-4'>
                  <p><strong>Name:</strong> {form.name}</p>
                  <p><strong>Phone:</strong> {form.phone || '-'}</p>
                  <p><strong>Email:</strong> {form.email}</p>

                  <button className='btn btn-outline-secondary' onClick={() => setIsEditing(true)}> <MdEdit />Edit</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className='border p-3'>
                  <div className='form-group'>
                    <label>Name:</label>
                    <input name="name" value={form.name || ''} onChange={handleChange} className='form-control'/>
                  </div>
                  <div className='form-group'>
                    <label>Phone:</label>
                    <input name="phone" value={form.phone || ''} onChange={handleChange} className='form-control'/>
                  </div>
                  <div className='form-group'>
                    <label>Email:</label>
                    <input value={form.email} disabled className='form-control'/>
                  </div>
                  <div>
                    <label>Profile Image:</label>
                    <input type="file" onChange={handleImage} />
                    {form.profile_image && <img src={`/uploads/${form.profile_image}`} alt="Profile" width={100} />}
                  </div>
                  <div className='mt-3'>
                        <button className='btn unique-button unique-button-border me-2' type="button" onClick={() => setIsEditing(false)}><MdCancel /> Cancel</button>
                  <button className='btn unique-button' type="submit"><MdSave /> Save</button>
                  </div>
                </form>
              )}
            </div>
            <div className="col-md-6">
              {/* Add Address Section */}
              <h3 className='mb-3'>Manage Addresses</h3>
              <button className='btn btn-outline-secondary' type="button" onClick={() => setShowNewAddressInput(prev => !prev)}>
                {showNewAddressInput ? 'Cancel' : 'Add New Address'}
                <MdAdd />
              </button>

              {showNewAddressInput && (
                <div className="mt-3">
                  <div className="form-group">
                     <input name="full_name" value={newAddress.full_name} onChange={handleChange} placeholder="Full Name" className='form-control'/>
                  </div>
                  <div className="form-group">
                     <input name="phone" value={newAddress.phone} onChange={handleChange} placeholder="Phone" className='form-control'/>
                  </div>
                  <div className="form-group">
                     <input name="country" value={newAddress.country} onChange={handleChange} placeholder="Country" className='form-control'/>
                  </div>
                  <div className="form-group">
                     <input name="state" value={newAddress.state} onChange={handleChange} placeholder="State" className='form-control'/>
                  </div>
                  <div className="form-group">
                     <input name="city" value={newAddress.city} onChange={handleChange} placeholder="City" className='form-control'/>
                  </div>
                  <div className="form-group">
                     <input name="zip" value={newAddress.zip} onChange={handleChange} placeholder="Zip" className='form-control'/>
                  </div>
                  <div className="form-group">
                     <textarea name="address" value={newAddress.address} onChange={handleChange} placeholder="Street Address" className='form-control'></textarea>
                  </div>
                  <label>
                    <input
                      type="checkbox"
                      name="is_primary"
                      checked={newAddress.is_primary}
                      onChange={(e) => setNewAddress({ ...newAddress, is_primary: e.target.checked })}
                    />
                    Set as Primary
                  </label>
                  <button className='btn unique-button' onClick={newAddress.id ? handleUpdateAddress : handleAddNewAddress}>
                    {newAddress.id ? 'Update Address' : 'Save Address'}
                    <MdSave />
                  </button>
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
                          checked={addr.is_primary}
                          onChange={() => handleSetPrimaryAddress(addr.id)}
                        />
                        Set as Primary
                      </label>
                      <button className='btn btn-outline-secondary' onClick={() => handleEditAddress(addr.id)}>Edit</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
