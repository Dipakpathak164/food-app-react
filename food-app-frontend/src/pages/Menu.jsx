import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import FoodList from '../components/FoodsList';
import TopSection from '../components/TopSection';
import toast from 'react-hot-toast';


const Menu = ({ imagePath, baseUrl }) => {

    return (
        <>
            <TopSection
                title="Our Menu"
                subtitle="Welcome to Eatsy – where great taste meets convenience!"
            />
            <section className="about-us-section py-5 commonColor">
                <div className="container">
                    <div className="row align-items-center">
                        <FoodList imagePath={imagePath} baseUrl={baseUrl} />
                    </div>
                </div>
            </section>
        </>
    );
};

export default Menu;
