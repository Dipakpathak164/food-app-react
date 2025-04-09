// src/components/TopSection.jsx
import React from 'react';

const TopSection = ({ title, subtitle }) => {
  return (
    <section className='top_common_section position-relative'>
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center content">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSection;
