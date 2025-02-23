import React from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { Product } from "../views/ChatWidget/api/renameChat";

interface ProductCardProps {
  product: Product;
  allowCart?: boolean;
  onAddToCart: (product: Product) => void;
  cart: { [key: string]: { quantity: number } };
  updateQuantity: (productId: string, quantity: number) => void;
  onProductClick?: (product: Product) => void;
  className: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  allowCart,
  onAddToCart,
  cart,
  updateQuantity,
  onProductClick,
  className
}) => {
  return (
    <div className={`bb-sm-product-item p-[5px] flex flex-col rounded-lg overflow-hidden ${className}`}>
      <div className="">
        <img
          src={product.image_url}
          alt={product.product_name}

          onClick={() => onProductClick?.(product)}
          className="w-full h-full object-cover cursor-pointer"
        />
      </div>
      <div className="bb-sm-product-item-content">
        {/* {product.brand_name && (
          <p className="bb-sm-product-brand">{product.brand_name}</p>
        )} */}
        <p
          className="font-medium text-md cursor-pointer mb-1 line-clamp-2"
          onClick={() => onProductClick?.(product)}
        >
          {product.product_name}
        </p>
        <p className="mb-1">{product.category}</p>
        <p className="font-medium text-md mb-2">
          ${product.price?.toFixed(2)}&nbsp;&nbsp;{product.display_weight}
        </p>
        <p className="text-sm mb-3 line-clamp-2">{product.description}</p>

        {allowCart && (
          <>
            {cart[product.product_id] ? (
              <div className="py-2 bb-sm-quantity-selector flex items-center justify-between gap-3 mt-auto rounded">
                <button
                  onClick={() => updateQuantity(product.product_id, -1)}
                  className="bb-sm-quantity-button w-8 h-8 rounded-full flex items-center justify-center"
                >
                  <FaMinus size={10} />
                </button>
                <span className="text-lg">
                  {String(cart[product.product_id].quantity)?.padStart(2, "0")}
                </span>
                <button
                  onClick={() => updateQuantity(product.product_id, 1)}
                  className="bb-sm-quantity-button w-8 h-8 rounded-full flex items-center justify-center"
                >
                  <FaPlus size={10} />
                </button>
              </div>
            ) : (
              <button
                className="bb-sm-add-to-cart-button w-full py-1"
                onClick={() => onAddToCart(product)}
              >
                Add to cart
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
