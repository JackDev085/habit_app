import './index.css'
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './navigation/navbar';
import Breadcrumb from './navigation/bedcrumb';
import Footer from './footer/footer';
import { useAuth } from './context/AuthContext';
import { registerPushNotifications } from './utils/notifications';

function App() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      registerPushNotifications({ promptUser: false }).catch((err) => {
        console.warn("Auto push subscription sync ignored:", err);
      });
    }
  }, [user]);


  return (
    <>
      <Navbar />
      <ToastContainer />
      <Breadcrumb />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;