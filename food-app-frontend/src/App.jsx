import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

const App = () => {
  const { isLoggingOut } = useAuth();
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
      <Navbar />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default App;
