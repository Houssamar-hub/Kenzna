import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CartDrawer from '../components/common/CartDrawer';

const MainLayout = () => {
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-kenzna-cream selection:bg-kenzna-amber/20 selection:text-kenzna-brown">
      <Navbar onOpenCart={() => setCartDrawerOpen(true)} />
      
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      {/* Slide-over quick cart drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
      />
    </div>
  );
};

export default MainLayout;
