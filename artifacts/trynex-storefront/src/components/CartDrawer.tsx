import { Link, useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { formatPrice } from "@/lib/utils";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, updateQuantity, removeFromCart, subtotal, itemCount } = useCart();
  const [, setLocation] = useLocation();
  const settings = useSiteSettings();
  const freeShippingThreshold = settings.freeShippingThreshold ?? 1500;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEsc);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEsc);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [open, onClose]);

  const handleCheckout = () => {
    onClose();
    setLocation("/checkout");
  };

  const handleViewCart = () => {
    onClose();
    setLocation("/cart");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
            role="dialog"
            aria-label="Shopping cart"
            aria-modal="true"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-black font-display text-gray-900">
                  Your Bag
                  {itemCount > 0 && (
                    <span className="ml-2 text-sm font-bold text-gray-400">({itemCount})</span>
                  )}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5" style={{ background: '#f3f4f6' }}>
                  <ShoppingBag className="w-10 h-10 text-gray-300" />
                </div>
                <p className="text-lg font-bold text-gray-900 mb-2">Your bag is empty</p>
                <p className="text-sm text-gray-400 mb-6 text-center">Discover amazing custom products and add them here</p>
                <button
                  onClick={() => { onClose(); setLocation("/products"); }}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-white text-sm active:scale-95 transition-transform"
                  style={{ background: 'linear-gradient(135deg, #E85D04, #FB8500)' }}
                >
                  Browse Collection <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                {subtotal < freeShippingThreshold && subtotal > 0 && (
                  <div className="px-5 py-2.5">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold"
                      style={{ background: 'rgba(232,93,4,0.06)', border: '1px solid rgba(232,93,4,0.15)', color: '#E85D04' }}>
                      <Tag className="w-3.5 h-3.5 shrink-0" />
                      Add {formatPrice(freeShippingThreshold - subtotal)} more for FREE shipping!
                    </div>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-3 p-3 rounded-xl"
                        style={{ background: '#fafafa', border: '1px solid #f0f0f0' }}
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                          <img
                            src={item.imageUrl || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=120&h=120&fit=crop'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/product/${item.productId}`}
                            onClick={onClose}
                            className="text-sm font-bold text-gray-900 hover:text-orange-600 transition-colors truncate block"
                          >
                            {item.name}
                          </Link>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {item.size && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-gray-200/60 text-gray-500">
                                {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-gray-200/60 text-gray-500 capitalize">
                                {item.color}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden bg-white">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-2 py-1 text-gray-400 hover:text-gray-700 transition-colors active:scale-90"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-black w-6 text-center text-xs text-gray-900">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2 py-1 text-gray-400 hover:text-gray-700 transition-colors active:scale-90"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="font-black text-sm text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="self-start p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors active:scale-90"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="border-t border-gray-100 px-5 py-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Subtotal</span>
                    <span className="text-xl font-black text-gray-900">{formatPrice(subtotal)}</span>
                  </div>

                  {subtotal >= freeShippingThreshold && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold"
                      style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.15)', color: '#16a34a' }}>
                      <Sparkles className="w-3.5 h-3.5" />
                      You qualify for FREE shipping!
                    </div>
                  )}

                  <button
                    onClick={handleCheckout}
                    className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                    style={{ background: 'linear-gradient(135deg, #E85D04, #FB8500)', boxShadow: '0 6px 24px rgba(232,93,4,0.35)' }}
                  >
                    Checkout <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleViewCart}
                    className="w-full py-2.5 rounded-xl font-semibold text-sm text-gray-500 hover:text-gray-700 transition-colors text-center"
                  >
                    View Full Cart
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
