import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { Product } from "../api/renameChat";
import ProductCard from "../../../components/ProductCard";

interface StoreViewProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  cart: { [key: string]: { quantity: number } };
  updateQuantity: (productId: string, quantity: number) => void;
}

const StoreView: React.FC<StoreViewProps> = ({
  products,
  onAddToCart,
  cart,
  updateQuantity,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) =>
    product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bb-sm-store-view">
      <div className="bb-sm-search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button>
          <FaSearch />
        </button>
      </div>
      <div className="bb-sm-product-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.cann_sku_id}
            product={product}
            onAddToCart={onAddToCart}
            cart={cart}
            updateQuantity={updateQuantity}
            allowCart={true}
          />
        ))}
      </div>
    </div>
  );
};

export default StoreView;
