import { useState } from 'react';
import TopSection from '../components/TopSection';

const FAQComponent = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "Can we pay online",
            answer: "Currently, we support Cash on Delivery (COD) only. Online payment options will be added in future updates."
        },
        {
            question: " Can I modify my order after placing it?",
            answer: "No, once the order is confirmed, it cannot be modified. You may cancel the order and place a new one if needed."
        },
        {
            question: "How long does shipping take?",
            answer: "Standard shipping takes 30-50 minutes."
        },
        {
            question: "Is my booking confirmed instantly?",
            answer: "Yes, once you submit the reservation form, your table is booked and will be confirmed on the admin side."
        }
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <>
            <TopSection
                title="FAQs"
                subtitle="Frequently Asked Questions"
            />
            <section className='commonColor pt-4'>
                <div className="faq-container">
                    <div className="faq-list">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                            >
                                <button
                                    className="faq-question"
                                    onClick={() => toggleFAQ(index)}
                                    aria-expanded={activeIndex === index}
                                    aria-controls={`faq-answer-${index}`}
                                >
                                    <span>{faq.question}</span>
                                    <span className="toggle-icon">
                                        {activeIndex === index ? '−' : '+'} {/* Plus/Minus version */}
                                        {/* Alternatively for arrows: */}
                                        {/* {activeIndex === index ? '↑' : '↓'} */}
                                    </span>
                                </button>

                                <div
                                    id={`faq-answer-${index}`}
                                    className="faq-answer"
                                    style={{
                                        maxHeight: activeIndex === index ? '500px' : '0',
                                        opacity: activeIndex === index ? '1' : '0'
                                    }}
                                >
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default FAQComponent;