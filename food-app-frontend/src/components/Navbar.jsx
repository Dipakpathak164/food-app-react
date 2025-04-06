import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ baseUrl = '/', imagePath = '/assets/images/'}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => (currentPath === path ? 'nav-item active' : 'nav-item');

  const topHeaderRef = useRef(null);
  const sidebarButtonRef = useRef(null);
  const navRef = useRef(null);
  const sideClickCloseRef = useRef(null);
  const overlayMenuRef = useRef(null);

  useEffect(() => {
    const toggleMenu = () => {
      sidebarButtonRef.current?.classList.toggle('active');
      navRef.current?.classList.toggle('active');
      sideClickCloseRef.current?.classList.toggle('active');
      overlayMenuRef.current?.classList.toggle('bg-body');
    };

    const handleScroll = () => {
      if (window.scrollY >= 40) {
        topHeaderRef.current?.classList.add('scrolled');
      } else {
        topHeaderRef.current?.classList.remove('scrolled');
      }
    };

    const sidebarBtn = sidebarButtonRef.current;
    const sideClick = sideClickCloseRef.current;

    sidebarBtn?.addEventListener('click', toggleMenu);
    sideClick?.addEventListener('click', toggleMenu);

    window.addEventListener('scroll', handleScroll);

    return () => {
      sidebarBtn?.removeEventListener('click', toggleMenu);
      sideClick?.removeEventListener('click', toggleMenu);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const { isLoggedIn, user, logout } = useAuth();

  return (
    <header>
      <div id="top__header" className="topheader" ref={topHeaderRef}>
        <div id="header">
          <div className="container">
            <nav className="navbar navbar-expand-md px-md-0 py-nav">
              <Link to={baseUrl} className="nav_brand animate__fadeInUp animate__animated">
                <img src={`${imagePath}logo.png`} alt="logo" className="img-responsive" width="94" />
              </Link>

              <button className="d-md-none d-block toggler-button" id="sidebarCollapse" type="button" ref={sidebarButtonRef}>
                <div className="bar-parents">
                  <div className="bar1"></div>
                  <div className="bar2"></div>
                  <div className="bar3"></div>
                </div>
              </button>

              <div className="d-xl-none d-block" id="side-click-close" ref={sideClickCloseRef}></div>

              <div className="collapse navbar-collapse mobile-nav" id="navbarNav" ref={navRef}>
                <ul className="contactLink">
                  <li>
                    Order by phone <br />
                    <a href="tel:9916819311">9916819311</a>
                  </li>
                </ul>

                <ul className="navbar-nav mx-auto main-ul">
                  <li className={isActive('/')}>
                    <Link to={baseUrl} className="nav-link animate__fadeInUp animate__animated">Home</Link>
                  </li>
                  <li className={isActive('/about-us')}>
                    <Link to={`${baseUrl}about-us`} className="nav-link animate__fadeInUp animate__animated">About Us</Link>
                  </li>
                  <li className={isActive('/faqs')}>
                    <Link to={`${baseUrl}faqs`} className="nav-link animate__fadeInUp animate__animated">FAQ</Link>
                  </li>
                  <li className={isActive('/blogs')}>
                    <Link to={`${baseUrl}blogs`} className="nav-link animate__fadeInUp animate__animated">Blogs</Link>
                  </li>
                  <li className={isActive('/contact-us')}>
                    <Link to={`${baseUrl}contact-us`} className="nav-link animate__fadeInUp animate__animated goService">Contact Us</Link>
                  </li>
                </ul>

                <ul>
                  <li className="me-md-3">
                    <a href="#" className="btn unique-button unique-button-border">Menu</a>
                  </li>
                </ul>

                {!isLoggedIn ? (
        <Link to="/signin" className="btn unique-button">
          Sign Up
        </Link>
      ) : (
        <ul className="d-flex">
          <li className="nav-item dropdown">
            <a data-bs-toggle="dropdown" className="dropdown-toggle" href="#">
              <img
                src={`${imagePath}no-profile.png`}
                className="userProfileImg"
                alt="profile"
                width="36"
              />
            </a>
            <ul className="dropdown-menu">
              <li>
                <Link className="nav-link" to="/profile">
                  <img src={`${imagePath}profile-circle.png`} alt="profile-circle" /> My Profile
                </Link>
              </li>
              <li>
                <button onClick={logout} className="nav-link btn btn-link">
                  <img src={`${imagePath}logoutNew.png`} alt="logout" /> Logout
                </button>
              </li>
            </ul>
          </li>
        </ul>
      )}
              </div>
              {/* This is for the bg-body toggle */}
              <div id="overlay_menu" ref={overlayMenuRef}></div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
