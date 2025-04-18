import React from 'react';
import FoodList from '../components/FoodsList';
import GetInTouch from './GetInTouch';

const Home = ({ imagePath, baseUrl }) => {
  return (
    <>
      <section className="heroSection position-relative">
        <div className="container position-relative">
          <div className="row">
            <div className="col-md-12 text-center">
              <h1>Delicious <br /> Buregers</h1>
            </div>
          </div>
          <img src={`${imagePath}floating_burger_01.png`} className="center_img" alt="center_img" />
        </div>
        <img src={`${imagePath}floating_fries_01.png`} className="left_img" alt="left_img" />
        <img src={`${imagePath}floating_fries_02.png`} className="right_img" alt="right_img" />
      </section>

      <section className="bestsellers-items">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h2>Bestsellers</h2>
            </div>
          </div>

          {/* 🧠 New dynamic food listing */}
          <FoodList imagePath={imagePath} baseUrl={baseUrl} />
        </div>

        <img src={`${imagePath}wave.svg`} className="w-100" alt="wave" />
      </section>

      <section className="promo_section position-relative">
        <img src={`${imagePath}home_01_delivery-768x708.png`} className="left_handimg" alt="delivery" />
        <div className="container">
          <div className="row">
            <div className="col-md-6 offset-md-6">
              <div>
                <img src={`${imagePath}logo.png`} alt="logo" />
                <h3>Free delivery 7 days a week</h3>
              </div>
            </div>
          </div>
        </div>
        <img src={`${imagePath}wave2.svg`} alt="wave" className="w-100 wave_bottom3" />
      </section>

      <section className="review_section position-relative">
        <div className="container">
          <h2>Reviews</h2>
          <div className="col-md-12">
            <img src={`${imagePath}floating_burger_01.png`} className="w-100" alt="center_img" />
          </div>
        </div>
        <img src={`${imagePath}floating_fries_01.png`} className="left_img left_img2" alt="left_img" />

        <div className="position-relative">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <img src={`${imagePath}reviews_01.png`} className="w-100" alt="reviews_01" />
              </div>
              <div className="col-md-6 d-flex align-items-center">
                <div>
                  <h5>"I don't remember a single mouthful I didn't enjoy!"</h5>
                  <p className="reviewer">@casey</p>
                </div>
              </div>
              <div className="col-md-6 d-flex align-items-center">
                <div className="text-right">
                  <h5>"Pretty impressive! Legit taste of burgers!!!"</h5>
                  <p className="reviewer">@mark_twin</p>
                </div>
              </div>
              <div className="col-md-6">
                <img src={`${imagePath}reviews_02-600x522.png`} className="w-100" alt="reviews_02" />
              </div>
              <div className="col-md-6">
                <img src={`${imagePath}reviews_03-600x478.png`} className="w-100" alt="reviews_03" />
              </div>
              <div className="col-md-6 d-flex align-items-center">
                <div>
                  <h5>"Eatsy burgers are some of the most tastiest burgers I've had!"</h5>
                  <p className="reviewer">@sarah_composer</p>
                </div>
              </div>
              {/* If there's more review rows, you can continue here */}
              <div class="col-md-6 d-flex align-items-center">
                <div class="text-right">
                  <h5>
                    "Awesome service and even better burgers!"
                  </h5>
                  <p class="reviewer">
                    @honeyb
                  </p>
                </div>
              </div>
              <div class="col-md-6">
                <img src={`${imagePath}reviews_04.png`} class="w-100" alt="reviews_01" />
              </div>
            </div>
          </div>
        </div>
        <img src={`${imagePath}wave2.svg`} alt="bottom_wave" class="w-100 bottom_wave"></img>
      </section>
      <section class="social_section">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <h4>
                Give us a follow
              </h4>
              <ul class="socialUl d-flex justify-content-center">
                <li>
                  <a href="#">
                    <img src={`${imagePath}facebook-app-symbol.png`} alt="facebook-app-symbol" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src={`${imagePath}instagram.png`} alt="instagram" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src={`${imagePath}linkedin.png`} alt="linkedin" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <img src={`${imagePath}wave.svg`} alt="wave" class="w-100 mb--bottom" />
      </section>
      <GetInTouch />
    </>
  );
};

export default Home;
