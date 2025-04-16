import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ConfirmModal from '../../components/ConfirmModal';

import { MdEdit, MdDelete, MdAdd } from 'react-icons/md';

const FoodLists = () => {
    const [foods, setFoods] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [foodToDelete, setFoodToDelete] = useState(null);

    useEffect(() => {
        fetchFoods();
    }, []);

    const fetchFoods = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/foods');
            setFoods(res.data);
        } catch (error) {
            toast.error('❌ Failed to fetch foods');
        }
    };

    const confirmDelete = (id) => {
        setFoodToDelete(id);
        setShowModal(true);
    };


    const handleDelete = async () => {
        if (!foodToDelete) return;

        const toastId = toast.loading('Deleting food...');

        try {
            const res = await axios.delete(`http://localhost:5000/api/foods/${foodToDelete}`);
            console.log("🧾 Delete response:", res);

            // Confirm the response and message
            if (res?.status === 200 && res.data?.message) {
                toast.success('Food deleted successfully', { id: toastId });
            } else {
                toast.success('Deleted (no message in response)', { id: toastId });
            }

            setFoods((prev) => prev.filter((f) => f.id !== foodToDelete));
        } catch (err) {
            console.error('Delete error:', err);
            toast.error('Failed to delete food', { id: toastId });
        } finally {
            setShowModal(false);
            setFoodToDelete(null);
        }
    };



    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Food List</h3>
                <Link to="/admin/add-food-items" className="btn btn-red"><MdAdd className=''/> Add New Food</Link>
            </div>
            <div className='table-responsive'>
            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th className='th_sm'>#</th>
                        <th>Name</th>
                        <th>Price (₹)</th>
                        <th>Discounted Price (₹)</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th className='sticky-col text-center bg-warning'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {foods.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center">No foods added yet.</td>
                        </tr>
                    ) : (
                        foods.map((food, index) => (
                            <tr key={food.id}>
                                <td>{index + 1}</td>
                                <td>{food.name}</td>
                                <td>{food.price}</td>
                                <td>{food.discounted_price || '-'}</td>
                                <td>{food.description}</td>
                                <td>
                                    {food.image && (
                                        <img
                                            src={`http://localhost:5000/uploads/${food.image}`}
                                            alt={food.name}
                                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                        />
                                    )}
                                </td>
                                <td className='sticky-col text-center'>
                                    <Link to={`/admin/foods/edit/${food.id}`} className="btn me-2 btnEdit">
                                    <MdEdit />
                                    </Link>
                                    <button
                                        onClick={() => confirmDelete(food.id)}
                                        className="btn btnDelete"
                                    >
                                         <MdDelete />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            </div>
            {/* Bootstrap Modal */}
            {showModal && (
                <ConfirmModal
                    show={showModal}
                    title="Confirm Delete"
                    message="Are you sure you want to delete this food item?"
                    onClose={() => setShowModal(false)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
};

export default FoodLists;
