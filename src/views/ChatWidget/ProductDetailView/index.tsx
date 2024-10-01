import React from "react";
import { Product } from "../api/renameChat";

interface ProductDetailViewProps {
  product: Product;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product }) => {
  return (
    <div className="bb-sm-product-detail">
      <img
        src={product.image_url}
        alt={product.product_name}
        className="bb-sm-product-detail-image"
      />
      <h2>{product.product_name}</h2>
      <p className="bb-sm-product-price">${product.price.toFixed(2)}</p>
      <p className="bb-sm-product-description">{product.description}</p>
      <button className="bb-sm-add-to-cart-button">Add to Cart</button>
    </div>
  );
};

export default ProductDetailView;
