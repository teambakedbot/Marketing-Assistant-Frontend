import { FaMinus, FaPlus } from "react-icons/fa";
import { Spinner } from ".";
import { memo, useContext, useRef } from "react";
import { CartContext } from "./CartContext";

const DealsView: React.FC<any> = memo(({ products, error, isLoading }) => {  
      const { cart, addToCart, updateQuantity } =
        useContext(CartContext)!;

    return (
      <>
        <div className="bb-sm-store-view h-full flex flex-col">
          <div className="flex rounded p-1 bg-[#F6F6F6]">
            <img
              src="/images/StoreHeader.jpeg"
              alt="Sample Image"
              className="rounded-full w-[35px] h-[35px]"
            />
            <div className="flex flex-col px-2">
              <p className="text-base font-semibold">
                Hey there! I'm Bud, your Ultra Cannabis assistant.
              </p>
              <p className="text-base">
                Here are products matching your preferences!
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="font-medium text-lg py-2 px-1 self-center">
              Deals of the day :
            </div>
            {/* Pagination Controls */}
            {/* <div className="flex justify-between">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
                className="px-2 py-2 rounded disabled:opacity-50"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    startIndex + itemsPerPage < products.length
                      ? prev + 1
                      : prev
                  )
                }
                disabled={startIndex + itemsPerPage >= products.length}
                className="px-2 py-2 rounded disabled:opacity-50"
              >
                <FaChevronRight />
              </button>
            </div> */}
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
                      <p
                        className="font-medium text-md cursor-pointer line-clamp-2"
                      >
                        {product.product_name}
                      </p>
                      <p className="text-secondary-color">{product.category}</p>
                      <p className="font-medium text-base">
                        ${product.latest_price?.toFixed(2)}&nbsp;&nbsp;
                        {product.display_weight}
                      </p>

                      {cart[product.id ?? product.product_id] ? (
                        <div className="py-1 bb-sm-quantity-selector flex items-center justify-between gap-3 mt-auto rounded">
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
                              updateQuantity(
                                product.id ?? product.product_id,
                                1
                              )
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
      </>
    );
  });

  export default DealsView;