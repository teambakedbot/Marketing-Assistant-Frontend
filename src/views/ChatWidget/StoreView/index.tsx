import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

const StoreView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch products from API
    // For now, we'll use dummy data
    setProducts([
      { id: "1", name: "Product 1", price: 19.99, image: "product1.jpg" },
      { id: "2", name: "Product 2", price: 29.99, image: "product2.jpg" },
      // Add more products...
    ]);
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreView;
