import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'dm_cart';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Cada item del carrito:
 * { tour: <objeto completo>, adultos: number, ninos: number }
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState(loadFromStorage);

  // Persistir en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const totalPersonas = (item) => item.adultos + item.ninos;
  const totalPrice = (item) => Number(item.tour.precio_desde) * totalPersonas(item);

  const cartTotal = items.reduce((acc, item) => acc + totalPrice(item), 0);
  const cartCount = items.length;

  function addToCart(tour, adultos = 1, ninos = 0) {
    setItems(prev => {
      const idx = prev.findIndex(i => i.tour.id === tour.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          adultos: updated[idx].adultos + adultos,
          ninos:   updated[idx].ninos   + ninos,
        };
        return updated;
      }
      return [...prev, { tour, adultos, ninos }];
    });
  }

  function updateItem(tourId, field, value) {
    setItems(prev =>
      prev.map(i =>
        i.tour.id === tourId ? { ...i, [field]: Math.max(0, value) } : i
      )
    );
  }

  function removeItem(tourId) {
    setItems(prev => prev.filter(i => i.tour.id !== tourId));
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider value={{
      items, cartTotal, cartCount,
      addToCart, updateItem, removeItem, clearCart,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
