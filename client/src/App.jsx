import { useState } from 'react';
import { LangProvider } from './context/LangContext';
import { CartProvider } from './context/CartContext';

import Navbar         from './components/Navbar';
import Hero           from './components/Hero';
import About          from './components/About';
import Packages       from './components/Packages';
import Activities     from './components/Activities';
import Gallery        from './components/Gallery';
import Contact        from './components/Contact';
import Footer         from './components/Footer';
import Cart           from './components/Cart';
import CheckoutModal  from './components/CheckoutModal';
import TourDetailModal from './components/TourDetailModal';
import { TermsModal, PrivacyModal, FaqModal } from './components/InfoModals';
import PWABanner from './components/PWABanner';

export default function App() {
  const [cartOpen,     setCartOpen]     = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [infoModal,    setInfoModal]    = useState(null); // 'terms' | 'privacy' | 'faq'

  function openCheckout() {
    setCartOpen(false);
    setCheckoutOpen(true);
  }

  return (
    <LangProvider>
      <PWABanner />
      <CartProvider>
        <Navbar onCartOpen={() => setCartOpen(true)} />

        <main>
          <Hero />
          <About />
          <Packages onDetails={setSelectedTour} />
          <Activities />
          <Gallery />
          <Contact />
        </main>

        <Footer
          onTerms={()   => setInfoModal('terms')}
          onPrivacy={()  => setInfoModal('privacy')}
          onFaq={()      => setInfoModal('faq')}
        />

        {/* Drawer carrito */}
        <Cart
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          onCheckout={openCheckout}
        />

        {/* Modal checkout */}
        <CheckoutModal
          open={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
        />

        {/* Modal detalle tour */}
        <TourDetailModal
          tour={selectedTour}
          onClose={() => setSelectedTour(null)}
        />

        {/* Modales info */}
        {infoModal === 'terms'   && <TermsModal   onClose={() => setInfoModal(null)} />}
        {infoModal === 'privacy' && <PrivacyModal onClose={() => setInfoModal(null)} />}
        {infoModal === 'faq'     && <FaqModal     onClose={() => setInfoModal(null)} />}
      </CartProvider>
    </LangProvider>
  );
}
