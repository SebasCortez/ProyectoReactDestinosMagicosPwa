import { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ onCartOpen }) {
  const { t, lang, setLang } = useLang();
  const { cartCount } = useCart();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const links = [
    { key: 'nav.home',     id: 'hero'     },
    { key: 'nav.about',    id: 'about'    },
    { key: 'nav.packages', id: 'packages' },
    { key: 'nav.gallery',  id: 'gallery'  },
    { key: 'nav.contact',  id: 'contact'  },
  ];

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <button className="navbar__logo" onClick={() => scrollTo('hero')}>
          <span className="navbar__logo-icon">✦</span>
          <span>Destinos<strong>Mágicos</strong></span>
        </button>

        <ul className={`navbar__links${menuOpen ? ' navbar__links--open' : ''}`}>
          {links.map(l => (
            <li key={l.key}>
              <button onClick={() => scrollTo(l.id)}>{t(l.key)}</button>
            </li>
          ))}
        </ul>

        <div className="navbar__actions">
          <div className="lang-switcher">
            {['es','en','pt'].map(lng => (
              <button
                key={lng}
                className={`lang-btn${lang === lng ? ' lang-btn--active' : ''}`}
                onClick={() => setLang(lng)}
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </div>

          <button className="cart-btn" onClick={onCartOpen} aria-label="Carrito">
            🛒
            {cartCount > 0 && (
              <span className="cart-btn__badge">{cartCount}</span>
            )}
          </button>

          <button
            className="burger"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menú"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
}
