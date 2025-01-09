import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
  useContext,
} from "react";
import bottom from "/images/Chatbot logo white background large-circle.png";
import botIcon from "/images/receiver.jpeg";
import product1 from "/images/product1.png";
import product2 from "/images/product2.png";
import sendIcon from "/images/send.png";
import axios from "axios";
import loadingIcon from "/images/loading-spinner-white.gif";
import Swal from "sweetalert2";
import ChatHistory from "./ChatHistory";
import "./main.css";
import useAuth from "../../hooks/useAuth";
import { Chats } from "../../models/ChatModels";
import {
  getChats,
  getChatMessages,
  sendMessage,
  renameChat,
  deleteChat,
  recordFeedback,
  retryMessage,
} from "../../utils/api";
import robotIcon from "/images/pointing.png"; // Import the robot icon
import notLoggedInIcon from "/images/security.png"; // Import the not logged in icon
import bluntSmokey from "/images/blunt-smokey.png";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../config/firebase-config";
import {
  FaStore,
  FaArrowLeft,
  FaCartPlus,
  FaFly,
  FaPaperPlane,
  FaTimes,
  FaEllipsisV,
  FaChevronLeft,
  FaChevronRight,
  FaShoppingCart,
  FaMinus,
  FaPlus,
  FaTrash,
} from "react-icons/fa"; // Import the store icon and back arrow icon
import { BASE_URL } from "../../utils/api";
import SettingsPage from "./settings";
import { CartContext } from "./CartContext";
import { Product, getThemeSettings, ProductResponse } from "./api/renameChat";
import { useParams } from "react-router-dom";
import { ThemeSettings } from "./settings";
const Spinner: React.FC = () => (
  <div className="bb-sm-spinner">
    <div className="bb-sm-bounce1"></div>
    <div className="bb-sm-bounce2"></div>
    <div className="bb-sm-bounce3"></div>
  </div>
);

// Add this helper function at the top of your file, outside the component
const getStateAbbreviation = (state: string): string => {
  const stateAbbreviations: { [key: string]: string } = {
    Alabama: "AL",
    Alaska: "AK",
    Arizona: "AZ",
    Arkansas: "AR",
    California: "CA",
    Colorado: "CO",
    Connecticut: "CT",
    Delaware: "DE",
    Florida: "FL",
    Georgia: "GA",
    Hawaii: "HI",
    Idaho: "ID",
    Illinois: "IL",
    Indiana: "IN",
    Iowa: "IA",
    Kansas: "KS",
    Kentucky: "KY",
    Louisiana: "LA",
    Maine: "ME",
    Maryland: "MD",
    Massachusetts: "MA",
    Michigan: "MI",
    Minnesota: "MN",
    Mississippi: "MS",
    Missouri: "MO",
    Montana: "MT",
    Nebraska: "NE",
    Nevada: "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    Ohio: "OH",
    Oklahoma: "OK",
    Oregon: "OR",
    Pennsylvania: "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    Tennessee: "TN",
    Texas: "TX",
    Utah: "UT",
    Vermont: "VT",
    Virginia: "VA",
    Washington: "WA",
    "West Virginia": "WV",
    Wisconsin: "WI",
    Wyoming: "WY",
  };
  return stateAbbreviations[state] || state;
};

//add props
interface ChatWidgetProps {
  skipVerify?: boolean;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  skipVerify = false,
}) => {
  const { customerID } = useParams<{ customerID: string }>();
  const [isAllowed, setIsAllowed] = useState<boolean | null>(true);

  useEffect(() => {
    const verifyOrigin = async () => {
      const customerID = "d";
      if (!customerID) {
        console.error("No customerID provided in URL.");
        setIsAllowed(false);
        return;
      }

      try {
        const customerData = { allowedOrigins: ["*"] };
        if (customerData) {
          const allowedOrigins: string[] = customerData.allowedOrigins || [];
          const currentOrigin = window.location.origin;

          if (
            allowedOrigins.includes(currentOrigin) ||
            allowedOrigins.includes("*")
          ) {
            console.log("Origin is allowed");
            setIsAllowed(true);
          } else {
            console.warn(
              `Origin ${currentOrigin} is not allowed for customerID ${customerID}`
            );
            setIsAllowed(false);
          }
        } else {
          console.warn(`No customer found with ID: ${customerID}`);
          setIsAllowed(false);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setIsAllowed(false);
      }
    };

    !skipVerify && verifyOrigin();
  }, [customerID]);

  const { displayName, photoURL, user } = useAuth();
  const { cart, addToCart, updateQuantity, removeFromCart, handleCheckout } =
    useContext(CartContext)!;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState(1);
  const [prompts, setPrompts] = useState<string>("");
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<
    { type: string; content: string; message_id: string }[]
  >([{ type: "ai", content: "Hey, how can I help?", message_id: "1" }]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNewChat, setIsNewChat] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<any[]>([]); // Add state for products
  const [searchQuery, setSearchQuery] = useState(""); // Add state for search query
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    chatId: string;
  } | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [newChatName, setNewChatName] = useState("");
  const renameInputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] =
    useState<GeolocationCoordinates | null>(null);
  const [userCity, setUserCity] = useState<string | null>(null);
  const [userState, setUserState] = useState<string | null>(null);

  type Windows =
    | "chat"
    | "store"
    | "product"
    | "settings"
    | "cart"
    | "checkOut";

  const [currentView, setCurrentView] = useState<Windows>("chat");
  const [previousView, setPreviousView] = useState<Windows | null>(null);

  const [settings, setSettings] = useState<ThemeSettings>({
    defaultTheme: "custom",
    botVoice: "male",
    allowedSites: [],
    defaultLanguage: "english",
    colors: {
      primaryColor: "#00A67D",
      secondaryColor: "#00766D",
      backgroundColor: "#1E1E1E",
      headerColor: "#2C2C2C",
      textColor: "#FFFFFF",
      textSecondaryColor: "#FFFFFF",
    },
  });
  function isLightColor(color: string): boolean {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  }

  const applyTheme = (theme: ThemeSettings) => {
    const root = document.documentElement;
    root.style.setProperty("--primary-color", theme.colors.primaryColor);
    root.style.setProperty("--secondary-color", theme.colors.secondaryColor);
    root.style.setProperty("--background-color", theme.colors.backgroundColor);
    root.style.setProperty("--header-color", theme.colors.headerColor);
    root.style.setProperty("--text-color", theme.colors.textColor);
    root.style.setProperty(
      "--text-secondary-color",
      theme.colors.textSecondaryColor
    );
    root.style.setProperty(
      "--footer-text-color",
      isLightColor(theme.colors.backgroundColor) ? "#333333" : "#CCCCCC"
    );
  };

  useEffect(() => {
    applyTheme(settings);
  }, [settings]);

  const handleViewSettings = () => {
    navigateTo("settings");
    setIsMenuOpen(false);
  };

  const handleSettingsClose = (signOut?: boolean) => {
    if (signOut) {
      loadChatHistory(null);
    }
    navigateTo("chat");
  };

  const handleSettingsSave = (newSettings: ThemeSettings) => {
    setSettings(newSettings);
  };

  const handleProductClick = (product) => {
    navigateTo("product");
    setSelectedProduct(product);
  };

  const handleBack = () => {
    navigateTo("chat");
    setSelectedProduct(null);
  };
  const fetchChatMessages = useCallback(async () => {
    if (!currentChatId || chatHistory.length > 0) return;
    try {
      const token = await user?.getIdToken();
      const messages = await getChatMessages(currentChatId, token);
      setChatHistory(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  }, [currentChatId, user, chatHistory]);

  const fetchUserChats = useCallback(async () => {
    try {
      if (!user) return;
      const token = await user!.getIdToken();
      const fetchedChats = await getChats(token);
      if (fetchedChats.length > 0) {
        setChats(fetchedChats);
      }
    } catch (error) {
      console.error("Error fetching user chats:", error);
    }
  }, [user]);
  const footerTextColor = isLightColor(settings.colors.backgroundColor)
    ? "#333333"
    : "#CCCCCC";

  const loadChatHistory = useCallback(
    async (chatId: string | null) => {
      setLoading(true);
      navigateTo("chat");
      setIsMenuOpen(false);
      if (chatId === null) {
        setIsNewChat(true);
        fetchUserChats();
        setActiveChatId(null);
        setCurrentChatId(null);
        setChatHistory([
          {
            type: "ai",
            content: "Hey, how can I help?",
            message_id: "1",
          },
        ]);
      } else {
        setIsNewChat(false);
        setActiveChatId(chatId);
        setCurrentChatId(chatId);
        try {
          const token = await user?.getIdToken();
          const messages = await getChatMessages(chatId, token);
          setChatHistory(messages);
        } catch (error) {
          console.error("Error loading chat history:", error);
        }
      }
      setLoading(false);
    },
    [user]
  );

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
      fetchUserChats();
    } else {
      setIsLoggedIn(false);
    }
  }, [user, fetchUserChats]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.valueAsNumber);
  };

  const handleModalBox = () => {
    setIsModalOpen(!isModalOpen);
  };

  const navigateTo = (newView: Windows) => {
    if (newView !== currentView) {
      setPreviousView(currentView);
      setCurrentView(newView);
    }
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    } else if (currentView !== "chat") {
      if (previousView) {
        setCurrentView(previousView);
        setPreviousView("chat");
      } else {
        setCurrentView("chat");
      }
    } else {
      setIsMenuOpen(true);
    }
  };

  const handleViewStore = () => {
    navigateTo("store");
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const fetchThemeSettings = async () => {
      if (!user) return;
      const token = await user!.getIdToken();
      const settings = await getThemeSettings(token);
      if (settings) {
        setSettings(settings);
      }
    };
    fetchThemeSettings();
  }, [user]);

  const getUserLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setUserLocation(position.coords);
          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            );
            const city =
              response.data.address.city ||
              response.data.address.town ||
              response.data.address.village;
            const state =
              response.data.address.state || response.data.address.country;
            setUserCity(city);
            setUserState(state ? getStateAbbreviation(state) : null);
          } catch (error) {
            console.error("Error getting location details:", error);
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      Swal.fire(
        "Error",
        "Geolocation is not supported by your browser.",
        "error"
      );
    }
  }, []);

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  const playHandler = async () => {
    if (!prompts || loading) return;
    setIsNewChat(false);

    let messageContent = prompts;
    if (
      prompts.toLowerCase().includes("find new location") &&
      userCity &&
      userState
    ) {
      messageContent = `Find a new location in ${userCity}, ${userState}`;
    } else if (
      prompts.toLowerCase().includes("find my location") &&
      userLocation
    ) {
      messageContent += ` (User's location: Latitude ${userLocation.latitude}, Longitude ${userLocation.longitude})`;
      if (userCity && userState) {
        messageContent += `, City: ${userCity}, State: ${userState}`;
      }
    }

    setChatHistory((prevHistory) => [
      ...prevHistory,
      { type: "human", content: messageContent, message_id: "2" },
      { type: "ai", content: "loading", message_id: "3" },
    ]);
    setPrompts("");
    setLoading(true);
    try {
      const token = await user?.getIdToken();
      const response = await sendMessage(
        messageContent,
        "voiceType",
        currentChatId,
        token
      );
      setChatHistory((prevHistory) => {
        const updatedHistory = [...prevHistory];
        updatedHistory[updatedHistory.length - 1] = response;

        return updatedHistory;
      });
      if (response.chat_id) {
        setCurrentChatId(response.chat_id);
        setActiveChatId(response.chat_id);
        fetchUserChats();
      }
    } catch (error: any) {
      Swal.fire({
        title: "Fetching Chat Answer",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const userPhoto = photoURL || "/images/person-image.png";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const LoginForm: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        // Implement your email/password login logic here
        onLogin();
      } catch (error) {
        console.error("Error signing in:", error);
      }
    };

    const handleGoogleSignIn = async () => {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        onLogin();
      } catch (error) {
        console.error("Error signing in with Google:", error);
      }
    };

    return (
      <form
        onSubmit={handleSubmit}
        className="bb-sm-login-form flex flex-col gap-6 w-full max-w-md"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="bb-sm-login-input p-3 rounded bg-gray-700 text-lg"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="bb-sm-login-input p-3 rounded bg-gray-700 text-lg"
        />
        <button
          type="submit"
          className="bb-sm-login-button border-2 border-white rounded-md p-3 text-lg hover:bg-white hover:text-gray-800 transition-colors"
        >
          Login
        </button>
        <div className="text-center my-4 text-lg">or</div>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="bb-sm-google-login-button border-2 border-white rounded-md p-3 text-lg flex items-center justify-center hover:bg-white hover:text-gray-800 transition-colors"
        >
          <img
            src="/images/google-icon.png"
            alt="Google"
            className="w-6 h-6 mr-2"
          />
          Login with Google
        </button>
      </form>
    );
  };

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      const mainArea = document.querySelector(".bb-sm-main-area");
      const header = document.querySelector(".bb-sm-chat-header");
      const contextMenu = document.querySelector(".bb-sm-context-menu");
      const chatRenameInput = document.querySelector(
        ".bb-sm-chat-rename-input"
      );
      if (
        mainArea &&
        mainArea.contains(e.target as Node) &&
        header &&
        !header.contains(e.target as Node) &&
        isMenuOpen
      ) {
        setIsMenuOpen(false);
      }
      if (contextMenu && !contextMenu.contains(e.target as Node)) {
        setContextMenu(null);
        setEditingChatId(null);
      }
      if (chatRenameInput && !chatRenameInput.contains(e.target as Node)) {
        setEditingChatId(null);
      }
    },
    [isMenuOpen]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  const fetchProducts = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<ProductResponse>(
        `${BASE_URL}/products?page=${page}&states=michigan`
      );
      const productsData = response.data.products.flatMap(
        (item) => item.products
      );
      setProducts(productsData);
      setTotalPages(response.data.pagination.total_pages);
      setTotalProducts(response.data.pagination.total);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(); // Fetch products on component mount
  }, [fetchProducts]);

  const handleSearch = async (page = 1) => {
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
      setTotalPages(response.data.pagination.total_pages);
      setTotalProducts(response.data.pagination.total);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error searching products:", error);
      setError("Failed to search products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, chatId });
  };

  const handleRenameChat = (chatId: string) => {
    setEditingChatId(chatId);
    setNewChatName(
      chats.find((chat: any) => chat.chat_id === chatId)?.name || ""
    );
    setContextMenu(null);
  };

  useEffect(() => {
    if (editingChatId && renameInputRef.current) {
      renameInputRef.current.focus();
    }
  }, [editingChatId]);

  const handleDeleteChat = async (chatId: string) => {
    try {
      const token = await user?.getIdToken();
      deleteChat(chatId, token);
      setChats(chats.filter((chat: any) => chat.chat_id !== chatId));
      setContextMenu(null);
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const handleSaveRename = async () => {
    if (!editingChatId || !newChatName.trim()) return;
    try {
      const token = await user?.getIdToken();
      renameChat(editingChatId, newChatName, token);
      setChats(
        chats.map((chat: any) =>
          chat.chat_id === editingChatId ? { ...chat, name: newChatName } : chat
        )
      );
      setEditingChatId(null);
    } catch (error) {
      console.error("Error renaming chat:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && !isLoading) {
      if (searchQuery) {
        handleSearch(newPage);
      } else {
        fetchProducts(newPage);
      }
    }
  };

  const handleFeedback = async (
    message_id: string,
    feedbackType: "like" | "dislike"
  ) => {
    try {
      if (!user) return;
      const token = await user!.getIdToken();
      const response = await recordFeedback(token, message_id, feedbackType);
      if (!response.ok) {
        throw new Error("Failed to record feedback");
      }
      console.log(
        `Feedback recorded: ${feedbackType} for message ${message_id}`
      );
    } catch (error) {
      console.error("Error recording feedback:", error);
    }
  };

  const handleRetry = async (message_id: string) => {
    try {
      const token = await user?.getIdToken();
      const response = await retryMessage(message_id, token);
      if (!response.ok) {
        throw new Error("Failed to retry message");
      }
      const result = await response.json();
      // Update chat history with the new response
      setChatHistory((prevHistory) => [...prevHistory, result]);
    } catch (error) {
      console.error("Error retrying message:", error);
    }
  };

  const CartView = () => (
    <div className="bb-sm-cart-view overflow-y-auto h-full">
      {Object.keys(cart).length === 0 ? (
        <p className="px-4">Your cart is empty.</p>
      ) : (
        <>
          <div className="bb-sm-cart-items px-4 pb-4">
            {Object.entries(cart).map(([productId, { product, quantity }]) => (
              <div
                key={productId}
                className="bb-sm-cart-item flex items-center space-x-3 mb-4"
              >
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{product.product_name}</h3>
                  <p className="text-sm text-gray-400">
                    THC: {product.percentage_thc} | CBD:{" "}
                    {product.percentage_cbd}
                  </p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => updateQuantity(productId, -1)}
                      className="bb-sm-quantity-button"
                    >
                      <FaMinus size={10} />
                    </button>
                    <span className="mx-2">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(productId, 1)}
                      className="bb-sm-quantity-button"
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <span>${(product.latest_price * quantity).toFixed(2)}</span>
                  <button
                    onClick={() => removeFromCart(productId)}
                    className="bb-sm-remove-button ml-2"
                    aria-label="Remove item"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="bb-sm-cart-summary px-4 py-4 border-t border-gray-700">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
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
            {/* <div className="flex justify-between mb-2 text-gray-400">
              <span>Discount</span>
              <span>-$6.89</span>
            </div> */}
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total</span>
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
            <button
              onClick={() => navigateTo("checkOut")}
              className="bb-sm-checkout-button w-full py-3 rounded text-lg font-semibold"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );

  const CheckoutView = () => {
    const [customerName, setCustomerName] = useState("");
    const [contactMethod, setContactMethod] = useState("email");
    const [contactValue, setContactValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      const contactInfo = {
        [contactMethod]: contactValue,
      };

      await handleCheckout(customerName, contactInfo);
      setIsLoading(false);
      navigateTo("chat");
    };

    const isFormValid =
      customerName.trim() !== "" && contactValue.trim() !== "";
    return (
      <div className="bb-sm-checkout-view p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="font-bold mb-2">Order Summary</h3>
            <div className="space-y-2 mb-4">
              {Object.entries(cart).map(
                ([productId, { product, quantity }]: any) => (
                  <div key={productId} className="flex justify-between text-sm">
                    <span>
                      {product.product_name} (x{quantity})
                    </span>
                    <span>${(product.latest_price * quantity).toFixed(2)}</span>
                  </div>
                )
              )}
            </div>
            <div className="flex justify-between font-bold">
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
          </div>
          <div className="flex justify-between mb-2">
            <label></label>
            <div>
              <button
                type="button"
                onClick={() => setContactMethod("email")}
                className={`mr-2 px-3 py-1 rounded text-md ${
                  contactMethod === "email"
                    ? "bg-primary-color text-secondary-color"
                    : "bg-secondary-color text-secondary-color opacity-70 hover:opacity-100"
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setContactMethod("phone")}
                className={`px-3 py-1 rounded text-md ${
                  contactMethod === "phone"
                    ? "bg-primary-color text-secondary-color"
                    : "bg-secondary-color text-secondary-color opacity-70 hover:opacity-100"
                }`}
              >
                Phone
              </button>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex-1">
              <input
                type={contactMethod === "email" ? "email" : "tel"}
                id="contact"
                placeholder={`Enter your ${contactMethod}`}
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="bb-sm-place-order-button w-full py-2 rounded mt-10 pb-2 disabled:opacity-50"
          >
            {isLoading ? "Placing order..." : "Place Order"}
          </button>
        </form>
      </div>
    );
  };
  const StoreView: React.FC<any> = memo(() => {
    return (
      <div className="bb-sm-store-view h-full flex flex-col overflow-hidden">
        <div className="bb-sm-results-header flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg">Showing results "{totalProducts}"</h2>
          <button
            className="text-sm hover:opacity-80"
            onClick={() => {
              setSearchQuery("");
              fetchProducts();
            }}
          >
            See all
          </button>
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
          <div className="flex-1 overflow-y-auto p-4">
            <div className="bb-sm-product-grid grid grid-cols-2 md:grid-cols-2 gap-4">
              {products?.map((product) => (
                <div
                  key={product.id}
                  className="bb-sm-product-item flex flex-col rounded-lg overflow-hidden"
                >
                  <div className="relative pt-[50%]">
                    <img
                      src={product.image_url}
                      alt={product.product_name}
                      className="absolute top-0 left-0 w-full h-full object-cover cursor-pointer"
                      onClick={() => handleProductClick(product)}
                    />
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <h3
                      className="text-md font-semibold cursor-pointer mb-1 line-clamp-2"
                      onClick={() => handleProductClick(product)}
                    >
                      {product.product_name}
                    </h3>
                    <p className="text-lg font-bold mb-2">
                      ${product.latest_price?.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    {cart[product.id] ? (
                      <div className="bb-sm-quantity-selector flex items-center justify-center gap-3 mt-auto">
                        <button
                          onClick={() => updateQuantity(product.id, -1)}
                          className="bb-sm-quantity-button w-8 h-8 rounded-full flex items-center justify-center"
                        >
                          <FaMinus size={10} />
                        </button>
                        <span className="text-lg">
                          {cart[product.id].quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, 1)}
                          className="bb-sm-quantity-button w-8 h-8 rounded-full flex items-center justify-center"
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                    ) : (
                      <button
                        className="bb-sm-add-to-cart-button w-full py-2 rounded-md mt-auto"
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

        <div className="bb-sm-pagination flex justify-center items-center gap-4 p-4 border-t border-gray-700">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="bb-sm-pagination-button w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-50"
            aria-label="Previous page"
          >
            <FaChevronLeft />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="bb-sm-pagination-button w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-50"
            aria-label="Next page"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    );
  });
  interface ProductDetailProps {
    product?: Product | null;
  }

  const ProductDetailView: React.FC<ProductDetailProps> = ({ product }) => {
    if (!product) {
      return null;
    }
    return (
      <div className="bb-sm-product-detail-view p-2">
        <div className="flex justify-center items-center pb-2 w-full rounded-md border-2 border-white mb-5">
          <img
            className="bb-sm-product-detail-image"
            src={product.image_url}
            alt={product.product_name}
          />
        </div>
        <div className="flex flex-row justify-between gap-2 pb-2">
          <h3 className="font-bold">{product.raw_product_name}</h3>
          <p className="price">${product.latest_price?.toFixed(2)}</p>
        </div>

        <div className="flex flex-row justify-around gap-2 pb-2 bb-sm-data-container">
          {product.percentage_thc && (
            <div className="flex flex-col justify-between gap-2 pb-2 text-center">
              <span className="font-bold">THC</span>
              <span className="text-md">{product.percentage_thc}</span>
            </div>
          )}
          {product.percentage_cbd && (
            <div className="flex flex-col justify-between gap-2 pb-2 text-center">
              <span className="font-bold">CBD</span>
              <span className="text-md">{product.percentage_cbd}</span>
            </div>
          )}
          {product.product_tags && (
            <div className="flex flex-col justify-between gap-2 pb-2 text-center">
              <span className="font-bold">Effects</span>
              <span className="text-md">
                {product.product_tags?.join(", ")}
              </span>
            </div>
          )}
        </div>

        {cart[product.id] ? (
          <div className="bb-sm-quantity-selector mt-10">
            <button
              onClick={() => updateQuantity(product.id, -1)}
              className="bb-sm-quantity-button"
            >
              <FaMinus size={12} />
            </button>
            <span className="mx-2">{cart[product.id].quantity}</span>
            <button
              onClick={() => updateQuantity(product.id, 1)}
              className="bb-sm-quantity-button"
            >
              <FaPlus size={12} />
            </button>
          </div>
        ) : (
          <button
            className="bb-sm-add-to-cart-button p-2 mt-10 "
            onClick={() => addToCart(product)}
          >
            Add To Cart
          </button>
        )}
      </div>
    );
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  if (isAllowed === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bb-sm-chat-widget bb-sm-body">
      {/* <button className="border-none outline-0" onClick={handleModalBox}>
        <img src={bluntSmokey} className="w-20" alt="Open Chatbot" />
      </button> */}
      {true && (
        <div className="absolute right-2 bottom-14 flex justify-center items-center z-50 bb-sm-animate-open">
          <div className="bb-sm-chat-container p-0 pb-2 rounded-lg shadow-lg relative max-h-[calc(100vh-4rem)] overflow-hidden">
            <div className="md:flex md:flex-row flex-col gap-3 h-full max-h-full lg:min-w-[500px]">
              {/* Chat area */}
              <div className="h-full w-full md:w-4/4 relative rounded-md p-2 flex flex-col gap-2 overflow-hidden bb-sm-main-area">
                <div className="bb-sm-chat-header flex items-center justify-between">
                  <div className="flex-1">
                    <button
                      className={`bb-sm-hamburger-menu ${
                        isMenuOpen || currentView !== "chat" ? "bb-sm-open" : ""
                      }`}
                      onClick={toggleMenu}
                    >
                      {currentView !== "chat" ? (
                        <FaArrowLeft />
                      ) : (
                        <>
                          <div></div>
                          <div></div>
                          <div></div>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-lg md:text-xl font-bold text-center flex-1">
                    {capitalizeFirstLetter(currentView || "")}
                  </p>
                  <div className="flex flex-row gap-5 justify-end items-center flex-1">
                    <button
                      className="bb-sm-header-icon"
                      onClick={handleViewStore}
                    >
                      <FaStore size={20} />
                    </button>
                    <div className="bb-sm-cart-icon-container bb-sm-header-icon">
                      <button className="" onClick={() => navigateTo("cart")}>
                        <FaShoppingCart size={20} />
                        {Object.keys(cart).length > 0 && (
                          <span className="bb-sm-cart-count">
                            {Object.values(cart).reduce(
                              (sum, { product, quantity }) => sum + quantity,
                              0
                            )}
                          </span>
                        )}
                      </button>
                    </div>
                    {/* <button
                      className="bb-sm-close-button bb-sm-header-icon"
                      onClick={handleModalBox}
                    ></button> */}
                  </div>
                </div>
                {currentView === "store" && <StoreView />}
                {currentView === "product" && (
                  <ProductDetailView product={selectedProduct} />
                )}
                {currentView === "settings" && (
                  <SettingsPage
                    onClose={handleSettingsClose}
                    onSave={handleSettingsSave}
                    initialSettings={settings}
                  />
                )}
                {currentView === "cart" && <CartView />}
                {currentView === "checkOut" && <CheckoutView />}
                {currentView === "chat" &&
                  (!isAllowed ? (
                    <div className="flex justify-center items-center h-full flex-col">
                      <h1 className="text-2xl font-bold">
                        This widget is not allowed on this site.
                      </h1>
                      <p>Login to add this site to your whitelist.</p>
                    </div>
                  ) : (
                    <>
                      {isNewChat && (
                        <div className="bb-sm-new-chat-view">
                          <div className="bb-sm-new-chat-content">
                            <img
                              src={bluntSmokey}
                              alt="Smokey Robot"
                              className="w-24 h-auto mb-2"
                            />
                            <h2 className="bb-sm-new-chat-title">
                              What's up, bud?
                            </h2>
                            <p className="bb-sm-new-chat-description">
                              I'm Smokey, your AI budtender. I'm here to help
                              you find the right strain for you.
                            </p>
                            <div className="bb-sm-new-chat-buttons">
                              <button
                                className="bb-sm-new-chat-button"
                                onMouseDown={() =>
                                  setPrompts("Show me new products")
                                }
                                onClick={() => playHandler()}
                              >
                                <span className="bb-sm-new-chat-button-icon">
                                  📦
                                </span>
                                See new products
                              </button>
                              <button
                                className="bb-sm-new-chat-button"
                                onMouseDown={() =>
                                  setPrompts("Show me Product Deals")
                                }
                                onClick={() => playHandler()}
                              >
                                <span className="bb-sm-new-chat-button-icon">
                                  💰
                                </span>
                                <span className="bb-sm-new-chat-button-text">
                                  NEW DEALS!
                                </span>
                              </button>
                              <button
                                className="bb-sm-new-chat-button"
                                onMouseDown={() =>
                                  setPrompts("Recommend a relaxing strain")
                                }
                                onClick={() => playHandler()}
                              >
                                <span className="bb-sm-new-chat-button-icon">
                                  🧘
                                </span>
                                Relaxing strain
                              </button>
                              <button
                                className="bb-sm-new-chat-button"
                                onMouseDown={() =>
                                  setPrompts("Tell me about CBD")
                                }
                                onClick={() => playHandler()}
                              >
                                <span className="bb-sm-new-chat-button-icon">
                                  🌿
                                </span>
                                Learn about CBD
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      {!isNewChat && (
                        <div className="bb-sm-chat-messages">
                          <ChatHistory
                            allowCart={true}
                            chatHistory={chatHistory}
                            loading={loading}
                            cart={cart}
                            updateQuantity={updateQuantity}
                            chatEndRef={chatEndRef}
                            onFeedback={handleFeedback}
                            onRetry={handleRetry}
                            onAddToCart={handleAddToCart}
                            onProductClick={(product) => {
                              setSelectedProduct(product);
                              navigateTo("product");
                            }}
                          />
                        </div>
                      )}
                    </>
                  ))}

                {(currentView == "store" || currentView == "chat") &&
                  isAllowed && (
                    <div className="bb-sm-chat-input">
                      <textarea
                        className="resize-none w-full placeholder-gray-200  p-2 min-h-[40px] max-h-[120px] overflow-y-auto"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            if (currentView === "chat") {
                              e.preventDefault();
                              playHandler();
                            }
                            if (currentView === "store") {
                              e.preventDefault();
                              handleSearch();
                            }
                          }
                        }}
                        placeholder={
                          currentView === "chat"
                            ? "Ask me anything..."
                            : "Search here..."
                        }
                        value={currentView === "chat" ? prompts : searchQuery}
                        onChange={(e) => {
                          if (currentView === "chat") {
                            setPrompts(e.target.value);
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = "40px";
                            const newHeight = Math.min(
                              Math.max(target.scrollHeight, 40),
                              120
                            );
                            target.style.height = `${newHeight}px`;
                            const chatInput = target.closest(
                              ".bb-sm-chat-input"
                            ) as HTMLElement;
                            if (chatInput) {
                              chatInput.style.minHeight = `${newHeight + 24}px`; // 24px for padding
                            }
                          }
                          if (currentView === "store") {
                            setSearchQuery(e.target.value);
                          }
                        }}
                        rows={1}
                      />
                      <button
                        onClick={playHandler}
                        disabled={loading}
                        className="bb-sm-send-button"
                      >
                        {loading ? (
                          <img
                            src={loadingIcon}
                            className="w-5 h-5"
                            alt="Loading"
                          />
                        ) : (
                          <FaPaperPlane />
                        )}
                      </button>
                    </div>
                  )}
              </div>

              {/* Side menu */}
              <div
                className={`bb-sm-side-menu ${isMenuOpen ? "bb-sm-open" : ""}`}
              >
                <div className="bb-sm-side-menu-header">
                  <div className="bb-sm-robot-icon-container">
                    <img
                      src={isLoggedIn ? robotIcon : notLoggedInIcon}
                      alt={isLoggedIn ? "Chat Bot" : "Not Logged In"}
                      className="bb-sm-robot-icon"
                    />
                  </div>
                  {isLoggedIn && (
                    <h2 className="bb-sm-chat-history-title">Chat history</h2>
                  )}
                  <button
                    className="bb-sm-settings-button"
                    onClick={() => loadChatHistory(null)}
                  >
                    New Chat
                  </button>
                </div>

                <div className="bb-sm-side-menu-content">
                  {isLoggedIn ? (
                    <div className="bb-sm-chat-history-scroll">
                      {chats.length > 0 ? (
                        chats.map(({ chat_id, name }: any, index) => (
                          <div
                            key={`${chat_id}-${index}`}
                            className="bb-sm-chat-item-container"
                          >
                            {editingChatId === chat_id ? (
                              <div className="bb-sm-chat-rename-input">
                                <input
                                  ref={renameInputRef}
                                  type="text"
                                  className="text-sm h-10"
                                  value={newChatName}
                                  onChange={(e) =>
                                    setNewChatName(e.target.value)
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSaveRename();
                                    if (e.key === "Escape")
                                      setEditingChatId(null);
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="bb-sm-chat-item-wrapper">
                                <button
                                  onClick={() => loadChatHistory(chat_id)}
                                  className={`bb-sm-menu-item text-md ${
                                    activeChatId === chat_id
                                      ? "bb-sm-active"
                                      : ""
                                  }`}
                                >
                                  {name}
                                </button>
                                <button
                                  className="bb-sm-chat-options-button"
                                  onClick={(e) => handleContextMenu(e, chat_id)}
                                >
                                  <FaEllipsisV className="text-secondary-color" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-4">
                          No conversations yet.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full w-full">
                      <h2 className="text-2xl font-bold mb-6">Login to Chat</h2>
                      <LoginForm onLogin={() => setIsLoggedIn(true)} />
                    </div>
                  )}
                </div>

                {isLoggedIn && (
                  <div className="bb-sm-side-menu-footer flex flex-row gap-2 mb-2">
                    <button
                      className="bb-sm-settings-button"
                      onClick={handleViewSettings}
                    >
                      Settings
                    </button>
                    <button
                      className="bb-sm-settings-button"
                      onClick={handleViewStore}
                    >
                      Shop
                    </button>
                  </div>
                )}
              </div>

              {/* Right panel */}
              <div className="h-full w-full md:w-1/3 rounded-md p-2 flex flex-col justify-between gap-1 bb-sm-right-panel">
                <div className="bb-sm-panel-container bb-sm-product-info">
                  <h3 className="text-center">Purple Punch I</h3>
                  <p className="text-center text-sm">
                    A premium cannabis strain
                  </p>
                  <img
                    src={
                      "https://images.weedmaps.com/pictures/listings/159/608/069/425191536_nug0454.jpg"
                    }
                    alt="Product Viewer"
                    className="w-full object-contain h-[100px] md:h-[150px]"
                  />
                </div>
                <div className="bb-sm-panel-container bb-sm-desired-effects">
                  <h4>Desired Effect:</h4>
                  <div className="bb-sm-effects-icons">
                    <input
                      type="range"
                      id="slider"
                      min="0"
                      max="4"
                      value={value}
                      onChange={handleChange}
                      className="w-full h-1 bg-dark-green-background-1 rounded-lg appearance-none border-0 outline-0 cursor-pointer accent-dark-green-background-3"
                      style={{
                        WebkitAppearance: "none",
                        appearance: "none",
                      }}
                    />
                    <div className="flex justify-between gap-1 text-sm text-gray-300 mt-4">
                      <span className="text-2xl text-center md:leading-[8px] tracking-tighter">
                        😴
                      </span>
                      <span className="text-2xl text-center md:leading-[8px] tracking-tighter">
                        🧘
                      </span>
                      <span className="text-2xl text-center md:leading-[8px] tracking-tighter">
                        🤗
                      </span>
                      <span className="text-2xl text-center md:leading-[8px] tracking-tighter">
                        💡
                      </span>
                      <span className="text-2xl text-center md:leading-[8px] tracking-tighter">
                        🚀
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bb-sm-panel-container bb-sm-community-reviews">
                  <h4 className="text-center">Community Reviews</h4>

                  <div className="bb-sm-reviews-list">
                    {/* Add sample reviews here */}
                    <div className="bb-sm-review text-md">
                      <b>Awesome</b>
                      <br /> Smell is 10/10 Taste is 10/10 High is 20/10 Smell
                      is 10/10 Taste is 10/10 High is 20/10 fireeeeee
                    </div>
                    <div className="bb-sm-review text-md">
                      <b>Lives up to the hype</b>
                      <br />
                      I've been using BakedBot for a while now and it's been a
                      game changer for me. I HIGHLY 🚀🪂
                    </div>
                    <div className="bb-sm-review text-md">
                      <b>Really Strong</b>
                      <br /> Its actually 32.21% total cannabinoids It's not
                      36.37% or whatever it says on the description.
                    </div>
                    {/* Add more sample reviews as needed */}
                  </div>
                </div>
              </div>
            </div>
            <p
              className="bb-sm-chat-footer mb-2 h-0 p-0 text-sm text-center"
              style={{ color: footerTextColor }}
            >
              Powered by BakedBot AI
            </p>
          </div>
        </div>
      )}
      {contextMenu && (
        <div
          className="bb-sm-context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            className="text-md"
            onClick={() => handleRenameChat(contextMenu.chatId)}
          >
            Rename
          </button>
          <button
            className="text-md"
            onClick={() => handleDeleteChat(contextMenu.chatId)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
