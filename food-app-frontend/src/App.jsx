// App.jsx
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import { useAuth } from './context/AuthContext';

const App = () => {
  const { isLoggingOut } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      {isLoggingOut && (
        <div className="logout-overlay d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-white bg-opacity-75" style={{ zIndex: 9999 }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <div className="mt-2">Logging out...</div>
          </div>
        </div>
      )}

      {/* Top-level CartDrawer */}
      <CartDrawer imagePath="/assets/images/" isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Pass toggle to Navbar */}
      <Navbar setCartOpen={setIsCartOpen} />

      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <main>
        <Outlet />
      </main>
    </>
  );
};

export default App;
