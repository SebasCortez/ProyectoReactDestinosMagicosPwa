import { useLang } from '../context/LangContext';
import { useCart } from '../context/CartContext';

export default function Cart({ open, onClose, onCheckout }) {
  const { t } = useLang();
  const { items, cartTotal, removeItem, updateItem, totalPrice } = useCart();

  return (
    <>
      {open && <div className="overlay" onClick={onClose} />}
      <aside className={`cart-drawer${open ? ' cart-drawer--open' : ''}`}>
        <div className="cart-drawer__header">
          <h2>{t('cart.title')}</h2>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>

        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <span>🛒</span>
              <p>{t('cart.empty')}</p>
              <small>{t('cart.emptyHint')}</small>
            </div>
          ) : (
            <ul className="cart-items">
              {items.map(item => (
                <li key={item.tour.id} className="cart-item">
                  <img src={item.tour.imagen_url} alt={item.tour.titulo} />
                  <div className="cart-item__info">
                    <p className="cart-item__title">{item.tour.titulo}</p>
                    <div className="cart-item__counters">
                      <div className="counter counter--sm">
                        <span>Ad.</span>
                        <button onClick={() => updateItem(item.tour.id, 'adultos', item.adultos - 1)}>−</button>
                        <span>{item.adultos}</span>
                        <button onClick={() => updateItem(item.tour.id, 'adultos', item.adultos + 1)}>+</button>
                      </div>
                      <div className="counter counter--sm">
                        <span>Ni.</span>
                        <button onClick={() => updateItem(item.tour.id, 'ninos', item.ninos - 1)}>−</button>
                        <span>{item.ninos}</span>
                        <button onClick={() => updateItem(item.tour.id, 'ninos', item.ninos + 1)}>+</button>
                      </div>
                    </div>
                    <p className="cart-item__price">${totalPrice(item).toFixed(2)}</p>
                  </div>
                  <button
                    className="icon-btn icon-btn--danger"
                    onClick={() => removeItem(item.tour.id)}
                    aria-label="Eliminar"
                  >
                    🗑
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-total">
              <span>{t('cart.total')}</span>
              <strong>${cartTotal.toFixed(2)}</strong>
            </div>
            <button className="btn btn--primary btn--full" onClick={onCheckout}>
              {t('cart.confirm')}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
