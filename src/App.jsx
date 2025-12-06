import './index.css'
import { Outlet } from 'react-router-dom'; // Adicione a importação do Outlet
import { ToastContainer } from 'react-toastify';
// NAVBAR E FOOTER GLOBAIS + BREADCRUMB DINÂMICO
import Navbar from './navigation/navbar';
import Breadcrumb from './navigation/bedcrumb';
import Footer from './footer/footer';

function App() {
  return (
    <>
      <Navbar />
    <ToastContainer />

      <Breadcrumb />
      <Outlet /> {/* Aqui as rotas filhas serão renderizadas */}
      <Footer />
    </>
  );
}

export default App;