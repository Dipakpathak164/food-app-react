import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import TopSection from '../components/TopSection';
import toast from 'react-hot-toast';


const AboutUs = ({ imagePath, baseUrl }) => {

    return (
        <>
            <TopSection
                title="About Us"
                subtitle="Welcome to Eatsy – where great taste meets convenience!"
            />
            <section className="about-us-section py-5 commonColor">
                <div className="container">
                    <div className="row align-items-center">

                        {/* Left Image */}
                        <div className="col-md-6 mb-4 mb-md-0">
                            <img
                                src={`${imagePath}floating_burger_01.png`}
                                alt="Our Restaurant"
                                className="img-fluid rounded"
                            />
                        </div>

                        {/* Right Content */}
                        <div className="col-md-6">
                            <h2 className="section-title mb-3">About Us</h2>
                            <p className="section-subtitle mb-3">
                                Welcome to Eatsy – where great taste meets convenience!
                            </p>
                            <p>
                                We are a local restaurant dedicated to serving delicious meals right to your doorstep.
                                Our online platform allows customers to browse menus, place orders, and reserve tables with ease.
                                We prioritize quality ingredients, fast service, and customer satisfaction.
                            </p>
                            <p>
                                Whether you're dining in or ordering out, Eatsy ensures an effortless experience every time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AboutUs;
