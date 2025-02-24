import { FaMinus, FaPlus } from "react-icons/fa";
import { Spinner } from ".";
import { memo, useContext, useState } from "react";
import { CartContext } from "./CartContext";
import axios from "axios";
import { BASE_URL } from "../../utils/api";

const StoreView: React.FC = memo(() => {
  const { cart, addToCart, updateQuantity } = useContext(CartContext)!;
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    if (!searchQuery) return;
    try {
      const response = await axios.get(
        `${BASE_URL}/products/search?query=${searchQuery}&states=michigan`
      );
      const productsData = response.data.products.flatMap(
        (item) => item.products
      );
      setProducts(productsData);
    } catch (error) {
      console.error("Error searching products:", error);
      setError("Failed to search products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bb-sm-store-view h-full flex flex-col">
      <div className="bb-sm-search-bar mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className="w-full p-2 rounded-lg"
        />
      </div>

      {error && (
        <div className="bb-sm-error-message border border-red-400 text-red-700 px-4 py-3 rounded relative m-4">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="bb-sm-loading-container flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : (
        <div className="flex-1">
          <div className="bb-sm-product-grid grid grid-cols-2 gap-2">
            {products.map((product) => (
              <div
                key={product.id}
                className="bb-sm-product-item p-[10px] flex flex-col rounded-lg overflow-hidden"
              >
                <div className="">
                  <img
                    src={product.image_url}
                    alt={product.product_name}
                    className="w-full h-full object-cover cursor-pointer"
                  />
                </div>
                <div className="pt-3 flex flex-col flex-1 justify-between">
                  <p className="font-medium text-md cursor-pointer line-clamp-2">
                    {product.product_name}
                  </p>
                  <p className="text-secondary-color">{product.category}</p>
                  <p className="font-medium text-base">
                    ${product.latest_price?.toFixed(2)}&nbsp;&nbsp;
                    {product.display_weight}
                  </p>

                  {cart[product.id ?? product.product_id] ? (
                    <div className="py-1 bb-sm-quantity-selector flex items-center justify-between gap-3 mt-auto rounded pt-3">
                      <button
                        onClick={() => updateQuantity(product.id, -1)}
                        className="bb-sm-quantity-button w-8 h-8 rounded-full flex items-center justify-center"
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="text-lg">
                        {String(
                          cart[product.id ?? product.product_id].quantity
                        )?.padStart(2, "0")}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(product.id ?? product.product_id, 1)
                        }
                        className="bb-sm-quantity-button w-8 h-8 rounded-full flex items-center justify-center"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="bb-sm-add-to-cart-button w-full py-1"
                      onClick={() => addToCart(product)}
                    >
                      Add to cart
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default StoreView;
