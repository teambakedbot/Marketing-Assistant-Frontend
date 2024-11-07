import React from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { Product } from "../views/ChatWidget/api/renameChat";

interface ProductCardProps {
  product: Product;
  allowCart?: boolean;
  onAddToCart: (product: Product) => void;
  cart: { [key: string]: { quantity: number } };
  updateQuantity: (productId: string, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  allowCart,
  onAddToCart,
  cart,
  updateQuantity,
}) => {
  return (
    <div className="bb-sm-product-item">
      <img src={product.image_url} alt={product.product_name} />
      <div className="bb-sm-product-item-content">
        {/* {product.brand_name && (
          <p className="bb-sm-product-brand">{product.brand_name}</p>
        )} */}
        <h3 className="bb-sm-product-name">{product.product_name}</h3>
        <p className="bb-sm-product-category">{product.category}</p>

        <div className="bb-sm-price-weight">
          <span className="bb-sm-product-price">
            ${product.latest_price?.toFixed(2)}
          </span>
          {product.display_weight && (
            <span className="bb-sm-product-weight">
              {" "}
              • {product.display_weight}
            </span>
          )}
        </div>

        {allowCart && (
          <>
            {cart[product.id] ? (
              <div className="bb-sm-quantity-selector">
                <button
                  onClick={() => updateQuantity(product.id, -1)}
                  className="bb-sm-quantity-button"
                >
                  <FaMinus size={8} />
                </button>
                <span className="text-sm">{cart[product.id].quantity}</span>
                <button
                  onClick={() => updateQuantity(product.id, 1)}
                  className="bb-sm-quantity-button"
                >
                  <FaPlus size={8} />
                </button>
              </div>
            ) : (
              <button
                className="bb-sm-add-to-cart-button"
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
