import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <>
      <Navbar />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default App;
