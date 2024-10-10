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
      <p className="bb-sm-product-price">${product.latest_price.toFixed(2)}</p>
      <p className="bb-sm-product-description">{product.raw_product_name}</p>
      <p className="bb-sm-product-category">
        {product.category} - {product.subcategory}
      </p>
      <p className="bb-sm-product-weight">{product.display_weight}</p>
      <p className="bb-sm-product-cannabinoids">
        THC: {product.percentage_thc.toFixed(2)}% | CBD:{" "}
        {product.percentage_cbd.toFixed(2)}%
      </p>
      <p className="bb-sm-product-tags">
        Tags: {product.product_tags.join(", ")}
      </p>
      <a href={product.url} target="_blank" rel="noopener noreferrer">
        View on website
      </a>
      <button className="bb-sm-add-to-cart-button">Add to Cart</button>
    </div>
  );
};

export default ProductDetailView;
