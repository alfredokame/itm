import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types/product.types";
import { getValidImageUrl } from "@/utils/imageHelper";

interface ProductCardProps {
  id: string | number;
  name: string;
  description?: string;
  price: number | string;
  image: string;
  year?: number;
  stock?: number;
  initialQuantity?: number;
  onAddToCart?: (id: string | number, quantity: number) => void;
  className?: string;
  badge?: string;
  oldPrice?: number | string;
}

export const ProductCard = ({
  id,
  name,
  description,
  price,
  image,
  year,
  stock = 10,
  initialQuantity = 1,
  onAddToCart,
  className = "",
  badge,
  oldPrice,
}: ProductCardProps) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const { addItem } = useCart();

  // Obtenemos la primera imagen del array (o undefined si no tiene)
  const imageUrl = getValidImageUrl(image);
  console.log("Image URL:", imageUrl); // Debug: Verificar la URL de la imagen

  const priceValue = typeof price === "number" ? price : Number(price);
  const normalizedPrice = Number.isFinite(priceValue) ? priceValue : 0;
  const formattedPrice = normalizedPrice.toFixed(2);

  const oldPriceValue =
    typeof oldPrice === "number" ? oldPrice : Number(oldPrice);
  const normalizedOldPrice = Number.isFinite(oldPriceValue) ? oldPriceValue : 0;
  const hasDiscount = normalizedOldPrice > normalizedPrice;

  const discountPercent = hasDiscount
    ? Math.round(
        ((normalizedOldPrice - normalizedPrice) / normalizedOldPrice) * 100,
      )
    : 0;

  const isLowStock = stock > 0 && stock <= 5;

  const increment = () => {
    if (quantity < stock) setQuantity(quantity + 1);
  };

  const decrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);

    if (!isNaN(val) && val >= 1 && val <= stock) {
      setQuantity(val);
    } else if (e.target.value === "") {
      setQuantity(1);
    }
  };

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const product: Product = {
      id: String(id),
      name,
      description: description ?? "",
      price: normalizedPrice,
      categoryId: "00000000-0000-0000-0000-000000000000",
      images: image ? [image] : [],
      stock,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addItem(product, quantity);

    if (onAddToCart) {
      onAddToCart(id, quantity);
    }
  };

  return (
    <Card
      className={`group relative flex h-full w-full max-w-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white text-left shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_52px_rgba(30,58,138,0.16)] ${className}`}
    >
      {/* Línea superior premium */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 opacity-90" />

      {/* ===== Imagen ===== */}
      <Link
        to={`/product/${id}`}
        className="relative block aspect-video w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/70"
      >
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain p-2.5 transition-transform duration-700 group-hover:scale-105"
        />

        {/* Overlay suave al hacer hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/15 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Brillo diagonal suave */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Badges superiores */}
        <div className="absolute left-3 top-3 z-20 flex flex-col items-start gap-2">
          {hasDiscount && (
            <span className="rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
              -{discountPercent}%
            </span>
          )}

          {!hasDiscount && badge && !isLowStock && (
            <span className="rounded-full border border-blue-200/70 bg-blue-950/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg backdrop-blur">
              {badge}
            </span>
          )}
        </div>

        {/* Año */}
        {year && (
          <span className="absolute right-3 top-3 z-20 rounded-full border border-amber-200/80 bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-amber-700 shadow-sm backdrop-blur">
            {year}
          </span>
        )}

        {/* Stock bajo */}
        {isLowStock && (
          <span className="absolute bottom-3 left-3 z-20 rounded-full border border-amber-200/80 bg-amber-50/95 px-2.5 py-1 text-[10px] font-semibold text-amber-800 shadow-sm backdrop-blur">
            Últimas {stock} unidades
          </span>
        )}

        {/* Agotado */}
        {stock === 0 && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/75 backdrop-blur-sm">
            <span className="rounded-full bg-slate-950/85 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-white">
              Agotado
            </span>
          </div>
        )}
      </Link>

      {/* ===== Información ===== */}
      <div className="flex flex-1 flex-col gap-2 p-2">
        <Link to={`/product/${id}`} className="block min-w-0">
          <h3
            className="truncate text-sm font-semibold text-slate-900 transition-colors group-hover:text-blue-950"
            title={name}
          >
            {name}
          </h3>

          {description && (
            <p
              className="mt-1 truncate text-xs text-slate-500"
              title={description}
            >
              {description}
            </p>
          )}
        </Link>

        <div className="mt-auto space-y-2">
          {/* Precio + stock */}
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              {hasDiscount && (
                <p className="text-xs font-medium text-slate-400 line-through">
                  ${normalizedOldPrice.toFixed(2)}
                </p>
              )}

              <p className="text-lg font-extrabold tracking-tight text-blue-950">
                ${formattedPrice}
              </p>
            </div>

            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                stock > 0
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  stock > 0 ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
              {stock > 0 ? "Disponible" : "Agotado"}
            </span>
          </div>

          {/* Cantidad + botón */}
          {stock > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex shrink-0 items-center rounded-full border border-slate-200 bg-slate-50 shadow-inner">
                <button
                  type="button"
                  aria-label="Disminuir cantidad"
                  onClick={decrement}
                  disabled={quantity <= 1}
                  className="px-1.5 py-1.5 text-slate-500 transition-colors hover:text-blue-950 disabled:opacity-30"
                >
                  <Minus className="h-3 w-3" />
                </button>

                <input
                  type="number"
                  min={1}
                  max={stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  aria-label="Cantidad"
                  className="w-8 bg-transparent text-center text-xs font-semibold text-slate-800 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />

                <button
                  type="button"
                  aria-label="Aumentar cantidad"
                  onClick={increment}
                  disabled={quantity >= stock}
                  className="px-1.5 py-1.5 text-slate-500 transition-colors hover:text-blue-950 disabled:opacity-30"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                className="h-9 flex-1 rounded-full bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 text-xs font-bold text-white shadow-lg shadow-blue-950/25 transition-all hover:brightness-110"
              >
                <ShoppingCart className="h-4 w-4" />
                Agregar
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
