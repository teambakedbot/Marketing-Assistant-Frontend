import { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { FaMinus, FaPlus, FaRegTrashAlt } from "react-icons/fa";

interface CheckoutViewProps {
  navigateTo: (view: any) => void;
  setCurrentView: (view: any) => void;
  contactInfo: {
    email: string;
    phone: string;
  };
  setContactInfo: (info: { email: string; phone: string }) => void;
  hasValidEmail: boolean;
}

const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const CheckoutView: React.FC<CheckoutViewProps> = ({
  navigateTo,
  setCurrentView,
  contactInfo,
  setContactInfo,
  hasValidEmail, // no longer used in internal logic
}) => {
  const { cart, updateQuantity, removeFromCart, handleCheckout } =
    useContext(CartContext)!;
  const { user } = useAuth();

  // Local state for the customer's name.
  // Initialize with user's displayName if available.
  const [customerName, setCustomerName] = useState(user?.displayName || "");
  // Toggle editing mode for both name and email.
  const [isEditingInfo, setIsEditingInfo] = useState<boolean>(
    user ? false : true
  );
  const [isLoading, setIsLoading] = useState(false);

  const isCartEmpty = Object.keys(cart).length === 0;

  // When not editing, fall back to the user's account info if available.
  const displayedName = isEditingInfo
    ? customerName
    : user?.displayName || customerName;
  const displayedEmail = isEditingInfo
    ? contactInfo.email
    : contactInfo.email || user?.email || "";

  const isEmailValid = validateEmail(displayedEmail);
  const isFormValid =
    !isCartEmpty && isEmailValid && displayedName.trim() !== "";

  // Toggle edit mode; when switching to editing mode, reset customer name to user.displayName if available.
  const handleToggleEdit = () => {
    if (!isEditingInfo && user?.displayName) {
      setCustomerName(user.displayName);
    }
    setIsEditingInfo((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsLoading(true);

    try {
      const totalPrice = Object.values(cart).reduce(
        (sum, { product, quantity }) => sum + product.latest_price * quantity,
        0
      );

      const formattedCart = Object.entries(cart).reduce(
        (acc, [productId, { product, quantity }]) => {
          acc[productId] = {
            sku: productId,
            product_name: product.product_name,
            quantity,
            price: product.latest_price,
            weight: product.display_weight || undefined,
          };
          return acc;
        },
        {} as Record<string, any>
      );

      const checkoutData = {
        name: displayedName,
        contact_info: { ...contactInfo, email: displayedEmail },
        cart: formattedCart,
        total_price: totalPrice,
      };

      const token = await user?.getIdToken();
      if (!token) throw new Error("No authentication token available");

      await handleCheckout(token, checkoutData);
      setCurrentView("order-confirm");
    } catch (error) {
      console.error("Checkout error:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to process checkout. Please try again.",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full p-2 overflow-y-scroll">
      {isCartEmpty ? (
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

          {/* Modern Contact Information Section */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-medium">Your Information</h4>
              <button
                onClick={handleToggleEdit}
                className="text-sm text-primary-color hover:underline"
              >
                {isEditingInfo ? "Done" : "Edit"}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name Field */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Name</label>
                {isEditingInfo ? (
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="p-2 text-sm border rounded focus:ring-1 focus:ring-primary-color"
                  />
                ) : (
                  <div className="p-2 border rounded bg-white text-sm">
                    {displayedName}
                  </div>
                )}
              </div>
              {/* Email Field */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Email</label>
                {isEditingInfo ? (
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={contactInfo.email}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        email: e.target.value,
                      })
                    }
                    className="w-full p-2 text-sm border rounded focus:ring-1 focus:ring-primary-color"
                  />
                ) : (
                  <div className="p-2 border rounded bg-white text-sm">
                    {displayedEmail}
                  </div>
                )}
              </div>
              {/* Phone Field */}
              <div className="flex flex-col sm:col-span-2">
                <label className="text-sm font-medium mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={contactInfo.phone}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, phone: e.target.value })
                  }
                  className="w-full p-2 text-sm border rounded focus:ring-1 focus:ring-primary-color"
                />
              </div>
            </div>
          </div>

          {!isEmailValid && (
            <p className="text-red-500 text-sm mt-2">
              Please provide a valid email address to continue
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
