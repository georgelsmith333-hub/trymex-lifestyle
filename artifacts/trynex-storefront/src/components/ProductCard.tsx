import { useLocation } from "wouter";
import { ShoppingCart, Star, Heart, Check, Eye, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const COLOR_MAP: Record<string, string> = {
  'Black': '#1a1a1a', 'White': '#f0f0f0', 'Grey': '#6b7280', 'Gray': '#6b7280',
  'Navy': '#1e3a5f', 'Olive': '#4a5240', 'Charcoal': '#374151', 'Maroon': '#7f1d1d',
  'Red': '#dc2626', 'Blue': '#1d4ed8', 'Cream': '#fef3c7', 'Khaki': '#a18b52',
  'Burgundy': '#6b1a2a', 'Brown': '#7c4a2b', 'Yellow': '#eab308', 'Green': '#16a34a',
  'Orange': '#ea580c', 'Pink': '#ec4899', 'Purple': '#7c3aed', 'Teal': '#0d9488',
  'Sky Blue': '#0ea5e9', 'Lime': '#84cc16', 'Coral': '#f97316', 'Indigo': '#6366f1',
};

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [, navigate] = useLocation();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { toast } = useToast();
  const { scarcityThreshold } = useSiteSettings();
  const [isAdding, setIsAdding] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glare: { x: 50, y: 50 } });
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const rating = product.rating ? parseFloat(String(product.rating)) : 4.9;
  const wishlisted = isWishlisted(product.id);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -8;
    const rotateY = ((x - cx) / cx) * 8;
    setTilt({
      x: rotateX,
      y: rotateY,
      glare: { x: (x / rect.width) * 100, y: (y / rect.height) * 100 },
    });
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setTilt({ x: 0, y: 0, glare: { x: 50, y: 50 } });
  }, []);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding) return;
    setIsAdding(true);
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    });
    toast({
      title: "✓ Added to cart",
      description: product.name,
      action: (
        <ToastAction altText="Checkout now" onClick={() => navigate("/checkout")}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white whitespace-nowrap border-0"
          style={{ background: '#E85D04' }}>
          Checkout <ArrowRight className="w-3 h-3" />
        </ToastAction>
      ),
    });
    setTimeout(() => setIsAdding(false), 1200);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      imageUrl: product.imageUrl,
    });
  };

  const goToDetail = () => navigate(`/product/${product.id}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ perspective: '800px' }}
    >
      <div
        ref={cardRef}
        onMouseEnter={() => setHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={goToDetail}
        className="rounded-2xl overflow-hidden group cursor-pointer select-none bg-white relative"
        style={{
          border: hovered ? '1.5px solid #fbd5b4' : '1.5px solid #f0e8e0',
          boxShadow: hovered
            ? '0 20px 60px rgba(232,93,4,0.15), 0 8px 24px rgba(0,0,0,0.1)'
            : '0 2px 12px rgba(0,0,0,0.05)',
          transform: hovered && !isMobile
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(4px)`
            : 'rotateX(0deg) rotateY(0deg)',
          transition: hovered ? 'transform 0.1s ease, box-shadow 0.3s ease, border-color 0.3s ease' : 'all 0.5s cubic-bezier(0.22,1,0.36,1)',
          willChange: 'transform',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Glare overlay */}
        {hovered && !isMobile && (
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl z-30"
            style={{
              background: `radial-gradient(circle at ${tilt.glare.x}% ${tilt.glare.y}%, rgba(255,255,255,0.18) 0%, transparent 60%)`,
              mixBlendMode: 'screen',
            }}
          />
        )}

        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden" style={{ background: '#f9f5f2' }}>
          {product.imageUrl ? (
            <>
              {!imgLoaded && (
                <div
                  className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-100 to-gray-200"
                  aria-hidden="true"
                />
              )}
              <img
                src={product.imageUrl}
                alt={product.name}
                onLoad={() => setImgLoaded(true)}
                className={cn(
                  "w-full h-full object-cover transition-all duration-700",
                  imgLoaded ? "opacity-100" : "opacity-0"
                )}
                style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: imgLoaded ? 'transform 0.6s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease' : 'opacity 0.4s ease' }}
                loading="lazy"
                width="400"
                height="500"
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
              <ShoppingCart className="w-16 h-16 text-orange-300" aria-hidden="true" />
            </div>
          )}

          {/* Discount / Stock Badges */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-black text-white"
                style={{ background: 'linear-gradient(135deg, #E85D04, #FB8500)', boxShadow: '0 2px 8px rgba(232,93,4,0.4)' }}>
                -{discount}%
              </span>
            )}
            {product.stock > 0 && product.stock <= (scarcityThreshold || 10) && (
              <motion.span
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="px-2.5 py-1 rounded-lg text-[10px] font-black text-amber-700"
                style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.35)' }}>
                Only {product.stock} left
              </motion.span>
            )}
            {product.stock === 0 && (
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-black text-red-600"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                Sold Out
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              background: wishlisted ? '#fff1f0' : 'rgba(255,255,255,0.92)',
              border: wishlisted ? '1.5px solid #fecaca' : '1px solid rgba(0,0,0,0.08)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Heart className="w-3.5 h-3.5"
              style={{ color: wishlisted ? '#E85D04' : '#9ca3af', fill: wishlisted ? '#E85D04' : 'none' }} />
          </button>

          {/* Quick view on hover */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-3 left-3 right-3 z-20"
          >
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToDetail(); }}
              className="w-full py-2 rounded-xl font-bold text-sm text-gray-700 flex items-center justify-center gap-2 transition-all"
              style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,0,0,0.08)' }}
            >
              <Eye className="w-3.5 h-3.5" /> Quick View
            </button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, j) => (
              <Star key={j} className="w-3 h-3"
                style={{ fill: j < Math.floor(rating) ? '#FB8500' : '#e5e7eb', color: j < Math.floor(rating) ? '#FB8500' : '#e5e7eb' }} />
            ))}
            <span className="text-xs text-gray-400 ml-1 font-semibold">{rating}</span>
          </div>

          {/* Name */}
          <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2.5 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>

          {/* Color dots */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              {product.colors.slice(0, 5).map((color, i) => (
                <div
                  key={i}
                  className="w-3.5 h-3.5 rounded-full shrink-0 transition-transform hover:scale-125"
                  style={{
                    background: COLOR_MAP[color] || '#ccc',
                    border: color === 'White' ? '1.5px solid #d1d5db' : '1.5px solid rgba(0,0,0,0.1)',
                  }}
                  title={color}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-[10px] text-gray-400 font-semibold">+{product.colors.length - 5}</span>
              )}
            </div>
          )}

          {/* Price + Cart */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              {product.discountPrice ? (
                <>
                  <span className="font-black text-orange-600 text-base">{formatPrice(product.discountPrice)}</span>
                  <span className="text-xs line-through text-gray-400">{formatPrice(product.price)}</span>
                </>
              ) : (
                <span className="font-black text-gray-900 text-base">{formatPrice(product.price)}</span>
              )}
            </div>

            <motion.button
              onClick={handleQuickAdd}
              disabled={product.stock === 0}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: isAdding
                  ? 'rgba(22,163,74,0.1)'
                  : 'linear-gradient(135deg, #E85D04, #FB8500)',
                border: isAdding ? '1px solid rgba(22,163,74,0.3)' : 'none',
                boxShadow: isAdding ? 'none' : '0 2px 8px rgba(232,93,4,0.3)',
                color: isAdding ? '#16a34a' : 'white',
              }}
            >
              {isAdding ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
