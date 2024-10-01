import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { Product } from "../api/renameChat";

const StoreView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch products from API
    // For now, we'll use dummy data
    setProducts([]);
  }, []);

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
          <div key={product.id} className="bb-sm-product-item">
            <img src={product.image_url} alt={product.product_name} />
            <h3>{product.product_name}</h3>
            <p>${product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreView;
