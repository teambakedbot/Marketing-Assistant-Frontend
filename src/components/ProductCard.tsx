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
  onAddToCart,
  allowCart,
  cart,
  updateQuantity,
}) => {
  return (
    <div className="bb-sm-product-card">
      <img
        src={product.image_url}
        alt={product.product_name}
        className="bb-sm-product-image"
      />
      <div className="bb-sm-product-info">
        <h3 className="bb-sm-product-name">{product.product_name}</h3>
        <p className="bb-sm-product-category">{product.category}</p>
        {product.brand_name && (
          <p className="bb-sm-product-brand">{product.brand_name}</p>
        )}
        <p className="bb-sm-product-price">
          ${product.latest_price.toFixed(2)}
        </p>
        {product.display_weight && (
          <p className="bb-sm-product-weight">{product.display_weight}</p>
        )}
        {/* {(product.percentage_thc || product.percentage_cbd) && (
          <p className="bb-sm-product-cannabinoids">
            {product.percentage_thc &&
              `THC: ${product.percentage_thc.toFixed(2)}%`}
            {product.percentage_thc && product.percentage_cbd && " | "}
            {product.percentage_cbd &&
              `CBD: ${product.percentage_cbd.toFixed(2)}%`}
          </p>
        )} */}
      </div>
      {allowCart &&
        (cart[product.cann_sku_id] ? (
          <div className="bb-sm-quantity-selector text-md">
            <button
              onClick={() => updateQuantity(product.cann_sku_id, -1)}
              className="bb-sm-quantity-button"
            >
              <FaMinus size={10} />
            </button>
            <span className="mx-2">{cart[product.cann_sku_id].quantity}</span>
            <button
              onClick={() => updateQuantity(product.cann_sku_id, 1)}
              className="bb-sm-quantity-button"
            >
              <FaPlus size={10} />
            </button>
          </div>
        ) : (
          <button
            className="text-md bb-sm-add-to-cart-button p-1 mt-2 align-end"
            onClick={() => onAddToCart(product)}
          >
            Add to cart
          </button>
        ))}
    </div>
  );
};

export default ProductCard;
