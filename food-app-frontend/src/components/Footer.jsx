const Footer = () => {
    return (
      <footer className="wave-section">
        <svg viewBox="0 0 1440 200" xmlns="http://www.w3.org/2000/svg" className="wave">
          <path fill="#f5e7c1" d="M0,100 C360,200 1080,0 1440,100 V200 H0 Z"></path>
        </svg>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <img src="/assets/images/logo.png" alt="logo" />
            </div>
  
            <div className="col-md-4">
              <h6>ABOUT US</h6>
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minima animi iste quia nisi sapiente dicta
                quibusdam maiores sequi consequuntur. Pariatur in vitae enim est incidunt corporis suscipit aspernatur rem
                cupiditate tempore iure, ea vel nisi nulla mollitia sint obcaecati, quisquam soluta? Tenetur doloribus amet
                praesentium quaerat fugit est et dignissimos.
              </p>
            </div>
  
            <div className="col-md-4 d-flex justify-content-center">
              <div>
                <h6>Quick Links</h6>
                <ul>
                  <li><a href="/">Home</a></li>
                  <li><a href="/about-us">About Us</a></li>
                  <li><a href="/menu">Menu</a></li>
                  <li><a href="/blogs">Blogs</a></li>
                  <li><a href="/contact">Contact Us</a></li>
                </ul>
              </div>
            </div>
  
            <div className="col-md-4 d-flex align-items-center flex-column">
              <div>
                <h6>Social Links</h6>
                <ul className="socialUl d-flex justify-content-center">
                  <li>
                    <a href="#">
                      <img src="/assets/images/facebook-app-symbol.png" alt="facebook" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <img src="/assets/images/instagram.png" alt="instagram" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <img src="/assets/images/linkedin.png" alt="linkedin" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
  
            <div className="col-md-12">
              <hr />
            </div>
  
            <div className="col-md-6 py-4 copyRight">
              <span>©2025. All rights reserved</span>
            </div>
  
            <div className="col-md-6 py-4 text-right copyRight">
              <a href="#">Privacy Policy</a>
              <a href="#" className="ms-3">Terms & Service</a>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  