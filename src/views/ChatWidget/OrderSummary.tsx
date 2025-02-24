import { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { FaMinus, FaPlus, FaRegTrashAlt } from "react-icons/fa";

  const CheckoutView = ({navigateTo ,setCurrentView}) => {

  const { cart, updateQuantity, removeFromCart, handleCheckout } =
    useContext(CartContext)!;
            const { displayName, photoURL, user } = useAuth();

    const [customerName, setCustomerName] = useState(user?.displayName || "");
    const [contactInfo, setContactInfo] = useState({
      email: user?.email || "",
      phone: "",
      useAltEmail: false, // New flag to track if user wants to use different email
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        // Calculate total price
        const totalPrice = Object.values(cart).reduce(
          (sum, { product, quantity }) => sum + product.latest_price * quantity,
          0
        );

        // Format cart items with required fields
        const formattedCart = Object.entries(cart).reduce(
          (acc, [productId, { product, quantity }]) => {
            acc[productId] = {
              sku: productId,
              product_name: product.product_name,
              quantity: quantity,
              price: product.latest_price,
              weight: product.display_weight || undefined, // Include weight if available
            };
            return acc;
          },
          {} as Record<string, any>
        );

        // Prepare contact info
        const contactDetails = {
          // renamed from contactInfo
          email: contactInfo.email,
          phone: contactInfo.phone,
        };

        // Prepare checkout data
        const checkoutData = {
          name: customerName,
          contact_info: contactDetails, // use renamed variable
          cart: formattedCart,
          total_price: totalPrice,
        };

        const token = await user?.getIdToken();
        if (!token) throw new Error("No authentication token available");

        await handleCheckout(token, checkoutData);
        setCurrentView("order-confirm");
      } catch (error) {
        console.error("Checkout error:", error);
        // You might want to show an error message to the user here
        Swal.fire({
          title: "Error",
          text: "Failed to process checkout. Please try again.",
          icon: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const cartIsEmpty = Object.keys(cart).length === 0;
    const hasValidEmail = contactInfo.email.trim() !== "";
    const isFormValid =
      !cartIsEmpty && hasValidEmail && customerName.trim() !== "";

    return (
      <div className="h-full p-2 overflow-y-scroll">
        {cartIsEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <button
              onClick={() => navigateTo("main")}
              className="text-primary-color hover:underline"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-[16px] font-medium mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {Object.entries(cart).map(
                ([productId, { product, quantity }]: any) => (
                  <div
                    key={productId}
                    className="flex items-center justify-between text-sm bg-white p-2 rounded-lg"
                  >
                    {/* Left Section: Image and Product Info */}
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={product.image_url}
                        alt={product.product_name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-gray-800 truncate">
                          {product.product_name}
                        </span>
                        <p className="font-normal text-xs opacity-40">
                          THC: {product.percentage_thc ?? 0} | CBD:{" "}
                          {product.percentage_cbd ?? 0}
                        </p>
                        <span className="font-semibold">
                          ${(product.latest_price * quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Right Section: Controls */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border rounded-lg bg-gray-50 h-8">
                        <button
                          onClick={() => updateQuantity(productId, -1)}
                          className="w-8 h-full flex items-center justify-center text-gray-700 hover:bg-gray-100"
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {quantity.toString().padStart(2, "0")}
                        </span>
                        <button
                          onClick={() => updateQuantity(productId, 1)}
                          className="w-8 h-full flex items-center justify-center text-gray-700 hover:bg-gray-100"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => removeFromCart(productId)}
                        className="w-8 h-8 flex items-center justify-center bg-red-100 rounded-lg text-red-500 hover:bg-red-200 transition"
                        aria-label="Remove item"
                      >
                        <FaRegTrashAlt size={16} />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="flex justify-between font-bold text-md mb-4">
              <span>Total:</span>
              <span>
                $
                {Object.values(cart)
                  .reduce(
                    (sum, { product, quantity }) =>
                      sum + product.latest_price * quantity,
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>

            {/* Coupon Code */}
            <div className="flex items-center border rounded-lg overflow-hidden mb-4">
              <input
                type="text"
                style={{ border: "none", outline: "none" }}
                placeholder="Coupon Code"
                className="flex-1 p-2 placeholder:text-sm border-none focus:outline-none"
              />
              <button className="bb-sm-redeem-button rounded ml-2 px-4 py-2 text-sm mr-1 font-medium">
                Redeem
              </button>
            </div>

            {/* Updated Contact Information Section */}
            <div className="space-y-4 mt-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  Contact Information
                </label>
                {user?.email ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      {/* hide this if not useing alt email */}
                      <div className="flex items-center gap-2 text-sm">
                        {!contactInfo.useAltEmail && (
                          <>
                            <span className="text-gray-600">
                              ✓ Using account email:
                            </span>
                            <span className="font-medium">{user.email}</span>
                          </>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          setContactInfo((prev) => ({
                            ...prev,
                            useAltEmail: !prev.useAltEmail,
                          }))
                        }
                        className="text-xs text-primary-color hover:underline"
                      >
                        {contactInfo.useAltEmail
                          ? "Use account email"
                          : "Change email"}
                      </button>
                    </div>
                    {contactInfo.useAltEmail && (
                      <input
                        type="email"
                        placeholder="Enter alternative email"
                        value={contactInfo.email}
                        onChange={(e) =>
                          setContactInfo({
                            ...contactInfo,
                            email: e.target.value,
                          })
                        }
                        className="w-full p-2 text-sm border rounded focus:ring-1 focus:ring-primary-color"
                      />
                    )}
                  </div>
                ) : (
                  <input
                    type="email"
                    placeholder="Email"
                    value={contactInfo.email}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, email: e.target.value })
                    }
                    className="w-full p-2 text-sm border rounded focus:ring-1 focus:ring-primary-color"
                  />
                )}
              </div>

              {/* Phone number input */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-500">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={contactInfo.phone}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, phone: e.target.value })
                  }
                  className="p-2 text-sm border rounded focus:ring-1 focus:ring-primary-color"
                />
              </div>
            </div>

            {/* Add validation message above Place Order button */}
            {!hasValidEmail && (
              <p className="text-red-500 text-sm mb-2">
                Please provide an email address to continue
              </p>
            )}

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              onClick={handleSubmit}
              className="flex-1 bb-sm-place-order-button w-full py-3 rounded-lg text-lg font-semibold flex justify-center items-center disabled:opacity-50 mt-8"
            >
              {isLoading ? "Placing Order..." : "Place Order"}
            </button>
          </>
        )}
      </div>
    );
  };

  export default CheckoutView;
