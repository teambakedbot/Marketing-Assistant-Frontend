import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
  useContext,
} from "react";
import axios from "axios";
import loadingIcon from "/images/loading-spinner-white.gif";
import Swal from "sweetalert2";
import ChatHistory from "./ChatHistory";
import "./main.css";
import useAuth from "../../hooks/useAuth";
import {
  getChats,
  getChatMessages,
  sendMessage,
  renameChat,
  deleteChat,
  recordFeedback,
  retryMessage,
} from "../../utils/api";
import bluntSmokey from "/images/blunt-smokey.png";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../config/firebase-config";
import {
  FaStore,
  FaArrowLeft,
  FaPaperPlane,
  FaChevronLeft,
  FaChevronRight,
  FaShoppingCart,
  FaMinus,
  FaPlus,
  FaRegTrashAlt,
  FaLongArrowAltRight,
  FaHome,
} from "react-icons/fa"; // Import the store icon and back arrow icon
import { HiMiniBars3CenterLeft } from "react-icons/hi2";
import { BASE_URL } from "../../utils/api";
import SettingsPage from "./settings";
import { CartContext } from "./CartContext";
import { Product, getThemeSettings, ProductResponse } from "./api/renameChat";
import { useParams } from "react-router-dom";
import { ThemeSettings } from "./settings";
import Sidebar from "./Sidebar";
import EventList from "./Events";
import { ArrowLeft } from "iconsax-react";
import { FaWandMagicSparkles } from "react-icons/fa6";

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
  view?: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  skipVerify = false,
  view = "chat",
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
    {
      type: string;
      content: string;
      message_id: string;
      error?: boolean;
      data?: {
        suggested_next_questions?: string[];
        images?: any[];
        products?: any[];
      };
    }[]
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
  const [selectedProductType, setSelectedProductType] = useState<any>("");
  const [userCity, setUserCity] = useState<string | null>(null);
  const [userState, setUserState] = useState<string | null>(null);

  type Windows =
    | "chat"
    | "store"
    | "product"
    | "settings"
    | "cart"
    | "checkOut"
    | "feel"
    | "main"
    | "order-confirm"
    | "events"
    | "product-type";

  const [currentView, setCurrentView] = useState<Windows>(
    view === "main" ? "main" : view === "events" ? "events" : "chat"
  );
  const [previousView, setPreviousView] = useState<Windows | null>(null);

  const [shouldPlay, setShouldPlay] = useState<boolean>(false);

  const [settings, setSettings] = useState<ThemeSettings>({
    defaultTheme: "custom",
    botVoice: "male",
    allowedSites: [],
    defaultLanguage: "english",
    colors: {
      primaryColor: "#65715F",
      secondaryColor: "#00766D",
      backgroundColor: "#FFFFFF",
      headerColor: "#FFFFFF",
      textColor: "#2C2C2C",
      textSecondaryColor: "#00000066",
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

  useEffect(() => {
    if (shouldPlay) {
      playHandler();
      setShouldPlay(false);
    }
  }, [shouldPlay]);

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

  const handleViewChat = () => {
    navigateTo("chat");
    setIsMenuOpen(false);
  };
  const handleViewStore = () => {
    navigateTo("main");
    setIsMenuOpen(false);
  };
  const handleViewProductType = () => {
    navigateTo("product-type");
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

    const tempMessageId = Date.now().toString();
    const userMessage = {
      type: "human",
      content: messageContent,
      message_id: tempMessageId,
    };
    const loadingMessage = {
      type: "ai",
      content: "loading",
      message_id: tempMessageId + "_response",
      error: false,
    };

    setChatHistory((prevHistory) => [
      ...prevHistory,
      userMessage,
      loadingMessage,
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
        const loadingIndex = updatedHistory.findIndex(
          (msg) => msg.message_id === tempMessageId + "_response"
        );
        if (loadingIndex !== -1) {
          updatedHistory[loadingIndex] = response;
        }
        return updatedHistory;
      });

      if (response.chat_id) {
        setCurrentChatId(response.chat_id);
        setActiveChatId(response.chat_id);
        fetchUserChats();
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      setChatHistory((prevHistory) => {
        const updatedHistory = [...prevHistory];
        const loadingIndex = updatedHistory.findIndex(
          (msg) => msg.message_id === tempMessageId + "_response"
        );
        if (loadingIndex !== -1) {
          updatedHistory[loadingIndex] = {
            type: "ai",
            content: "Sorry, I encountered an error. Please try again.",
            message_id: tempMessageId + "_response",
            error: true,
          };
        }
        return updatedHistory;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async (message_id: string) => {
    // Find the failed message and its corresponding user message
    const messageIndex = chatHistory.findIndex(
      (msg) => msg.message_id === message_id
    );
    if (messageIndex <= 0) return;

    const userMessage = chatHistory[messageIndex - 1];
    if (!userMessage || userMessage.type !== "human") return;

    // Remove the failed message
    setChatHistory((prevHistory) => {
      const newHistory = [...prevHistory];
      newHistory[messageIndex] = {
        type: "ai",
        content: "loading",
        message_id: message_id,
        error: false,
      };
      return newHistory;
    });

    setLoading(true);
    try {
      const token = await user?.getIdToken();
      const response = await sendMessage(
        userMessage.content,
        "voiceType",
        currentChatId,
        token
      );

      setChatHistory((prevHistory) => {
        const newHistory = [...prevHistory];
        const retryIndex = newHistory.findIndex(
          (msg) => msg.message_id === message_id
        );
        if (retryIndex !== -1) {
          newHistory[retryIndex] = response;
        }
        return newHistory;
      });

      if (response.chat_id) {
        setCurrentChatId(response.chat_id);
        setActiveChatId(response.chat_id);
        fetchUserChats();
      }
    } catch (error) {
      console.error("Retry error:", error);
      setChatHistory((prevHistory) => {
        const newHistory = [...prevHistory];
        const retryIndex = newHistory.findIndex(
          (msg) => msg.message_id === message_id
        );
        if (retryIndex !== -1) {
          newHistory[retryIndex] = {
            type: "ai",
            content: "Sorry, I encountered an error. Please try again.",
            message_id: message_id,
            error: true,
          };
        }
        return newHistory;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = (message_id: string) => {
    setChatHistory((prevHistory) => {
      const messageIndex = prevHistory.findIndex(
        (msg) => msg.message_id === message_id
      );
      if (messageIndex === -1) return prevHistory;

      // Remove both the error message and the user's message
      const newHistory = [...prevHistory];
      newHistory.splice(messageIndex - 1, 2);
      return newHistory;
    });
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

  const CartView = () => (
    <div className="bb-sm-cart-view flex flex-col justify-between overflow-y-auto h-full">
      {Object.keys(cart).length === 0 ? (
        <p className="px-4">Your cart is empty.</p>
      ) : (
        <>
          <div className="px-4 pb-4">
            {Object.entries(cart).map(([productId, { product, quantity }]) => (
              <div
                key={productId}
                className="flex items-center justify-between bg-white py-3 rounded-lg shadow-md"
              >
                {/* Product Image */}
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  className="w-16 h-16 object-cover rounded-lg"
                />

                {/* Product Details */}
                <div className="flex flex-col flex-grow pl-2">
                  <h3 className="font-medium text-xl">
                    {product.product_name}
                  </h3>
                  <p className="font-normal text-sm py-1 opacity-40">
                    THC: {product.percentage_thc ?? 0} | CBD:{" "}
                    {product.percentage_cbd ?? 0}
                  </p>
                  <span className="text-xl font-medium">
                    ${(product.latest_price * quantity).toFixed(2)}
                  </span>
                </div>

                {/* Quantity Controls */}
                <div className="border rounded-lg opacity-60 border-opacity-100 flex items-center space-x-2 mr-4">
                  <button
                    onClick={() => updateQuantity(productId, -1)}
                    className="p-2 w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-200"
                  >
                    <FaMinus size={12} />
                  </button>
                  <span className="text-lg font-medium">
                    {quantity.toString().padStart(2, "0")}
                  </span>
                  <button
                    onClick={() => updateQuantity(productId, 1)}
                    className="p-2 w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-200"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(productId)}
                  className="bg-red-100 p-2 rounded-lg text-red-500 hover:bg-red-200 transition"
                  aria-label="Remove item"
                >
                  <FaRegTrashAlt size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="bb-sm-cart-summary py-4 border-t border-gray-7000">
            <div className="font-normal flex justify-between mb-6 text-lg">
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
            <div className="flex justify-between font-semibold text-lg mb-4 text-lg">
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
              className="bb-sm-checkout-button w-full py-4 flex items-center justify-center space-x-2 rounded-lg text-lg font-semibold"
            >
              <span>Checkout</span>
              <FaLongArrowAltRight />
            </button>
          </div>
        </>
      )}
    </div>
  );

  const CheckoutView = () => {
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
  const MainView: React.FC<any> = memo(() => {
    const flowers = [
      {
        name: "Flower",
        type: "Traditional",
        description: "Traditional cannabis buds",
        image: "/images/productType1.png",
      },
      {
        name: "Pre-Roll",
        type: "Pre-Roll",
        description: "Ready-to-smoke joints",
        image: "/images/productType2.png",
      },
      {
        name: "Vape",
        type: "Vape",
        description: "Ready-to-smoke joints",
        image: "/images/Vape.png",
      },
      {
        name: "Edible",
        type: "Edible",
        description: "Ready-to-smoke joints",
        image: "/images/Edible.png",
      },
    ];

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 2;

    // Calculate sliced products for the current page
    const startIndex = currentPage * itemsPerPage;
    const paginatedProducts = products.slice(
      startIndex,
      startIndex + itemsPerPage
    );

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
                        onClick={() => handleProductClick(product)}
                      />
                    </div>
                    <div className="pt-3 flex flex-col flex-1">
                      <p
                        className="font-medium text-md cursor-pointer line-clamp-2"
                        onClick={() => handleProductClick(product)}
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

  const ProductType: React.FC<any> = memo(() => {
    const productTypes = [
      {
        name: "Flower",
        description: "Traditional cannabis buds",
        image: "/images/productType1.png",
      },
      {
        name: "Pre-Roll",
        description: "Ready-to-smoke joints",
        image: "/images/productType2.png",
      },
      {
        name: "Vape",
        description: "Vaporizer cartridges",
        image: "/images/Vape.png",
      },
      {
        name: "Edible",
        description: "Cannabis-infused foods",
        image: "/images/Edible.png",
      },
      {
        name: "Concentrate",
        description: "Potent extracts",
        image: "/images/concentrate.png",
      },
      {
        name: "Tincture",
        description: "Liquid extracts",
        image: "/images/tincture.png",
      },
      {
        name: "Topical",
        description: "Skin applications",
        image: "/images/topical.png",
      },
      {
        name: "Accessories",
        description: "Smoking devices",
        image: "/images/accessories.png",
      },
    ];

    return (
      <div className="flex flex-col justify-between overflow-y-scroll">
        <h3 className="py-1 text-[17px] font-medium text-center">
          What type of product are you looking for?
        </h3>
        <p className="pt-1 pb-2 text-center">Select a product category</p>
        <div className="flex-1 overflow-y-auto py-2">
          <div className="bb-sm-product-grid grid grid-cols-2 md:grid-cols-2 gap-2">
            {productTypes.map((type, index) => (
              <div
                key={index}
                className="border p-2 flex flex-col rounded-lg overflow-hidden cursor-pointer hover:border-[#65715F] hover:bg-[#65715F]/10 transition-all duration-300"
                onClick={() => {
                  setSelectedProductType(type);
                  navigateTo("feel");
                }}
              >
                <div className="self-center">
                  <img
                    src={type.image}
                    alt={type.name}
                    className="h-[40px] w-[40px] object-contain"
                  />
                </div>
                <div className="pt-2 flex flex-col flex-1 items-center">
                  <p className="font-medium">{type.name}</p>
                  <p className="text-xs text-center text-gray-500">
                    {type.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  });

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
                  className="bb-sm-product-item p-[10px] flex flex-col rounded-lg overflow-hidden"
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

  interface FeelingScreenProps {
    selectedProductType: any | null;
  }

  const FeelingsScreen: React.FC<FeelingScreenProps> = memo(
    ({ selectedProductType }) => {
      const feelings = [
        {
          name: "Creative",
          description: "Induce happiness",
          image: "/images/creative.png",
        },
        {
          name: "Energized",
          description: "Boost imagination",
          image: "/images/energized.png",
        },
        {
          name: "Focused",
          description: "Increase vitality",
          image: "/images/focused.png",
        },
        {
          name: "Euphoric",
          description: "Enhance Concentration",
          image: "/images/euorphic.png",
        },
        {
          name: "Giggly",
          description: "Elevate mood",
          image: "/images/gigly.png",
        },
        {
          name: "Relaxed",
          description: "Induce happiness",
          image: "/images/relaxed.png",
        },
        {
          name: "Tingly",
          description: "Aid relaxation",
          image: "/images/tingly.png",
        },
        {
          name: "Stimulated",
          description: "Aid relaxation",
          image: "/images/stimulated.png",
        },
      ];
      const [selectedFeelings, setSelectedFeelings] = useState<any>([]);
      console.log("SELECTED FEELINGS", shouldPlay);
      const handleSelect = (feel) => {
        if (selectedFeelings.includes(feel)) {
          if (selectedFeelings.length === 1) return;
          setSelectedFeelings(selectedFeelings.filter((f) => f !== feel));
        } else {
          if (selectedFeelings.length >= 2) return;
          setSelectedFeelings([...selectedFeelings, feel]);
        }
      };

      const handleClick = () => {
        setCurrentView("chat");
        setPrompts(
          `Show me the ${
            selectedProductType.name
          } that makes me feel ${selectedFeelings.join(" and ")}`
        );
        setShouldPlay(true);
      };
      return (
        <div className="flex flex-col justify-between h-full overflow-y-scroll">
          <h3 className="py-1 text-[17px] font-medium text-center">
            How do you want to feel?
          </h3>
          <p className="pt-1 pb-2 text-center">Select up to two effects</p>
          <div className="flex-1 overflow-y-auto py-2">
            <div className="bb-sm-product-grid grid grid-cols-3 md:grid-cols-3 gap-2 overflow-scroll">
              {feelings?.map((feel, index) => (
                <div
                  key={index}
                  className={`border p-2 flex flex-col rounded-lg overflow-hidden cursor-pointer transition duration-300
          ${
            selectedFeelings.includes(feel.name)
              ? "border border-[#65715F] bg-[#65715F]/10"
              : "border-gray-300"
          }`}
                  onClick={() => handleSelect(feel.name)}
                >
                  <div className="self-center">
                    <img
                      src={feel.image}
                      alt={feel.name}
                      className=" h-[30px] w-[30px] object-contain"
                    />
                  </div>
                  <div className="pt-2 flex flex-col flex-1 items-center">
                    <p>{feel.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={handleClick}
            disabled={selectedFeelings.length === 0}
            className="bb-sm-next-button w-full flex items-center justify-center space-x-2 m p-1 rounded-lg mt-2 disabled:opacity-75"
          >
            Next <FaLongArrowAltRight className="ml-1" />
          </button>
          <p className="text-center text-md mt-2">
            By using this product, you agree to our Terms & Privcy Policy
          </p>
        </div>
      );
    }
  );
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

  const OrderConfirmation: React.FC<any> = () => {
    const [confirmed, setConfirmed] = useState(false);

    return (
      <div className="flex flex-col items-center justify-center h-screen p-6">
        {!confirmed ? (
          <div className="text-center max-w-md w-full">
            <img
              src="/images/pointing.png"
              alt="Order Confirmation"
              className="mx-auto h-[220px]"
            />
            <h2 className="text-2xl font-medium">Order Confirmation</h2>
            <p className="text-gray-600 mt-2">
              Your order will be ready for pick up in 15 minutes. Use code{" "}
              <span className="font-bold">"UltraHigh"</span> to save on your
              next order.
            </p>
            <div className="flex gap-4 mt-6">
              <button
                className="w-full p-2 border-2 border-[var(--primary-color)] text-[var(--primary-color)] font-semibold rounded-lg"
                onClick={() => setCurrentView("checkOut")}
              >
                Cancel
              </button>
              <button
                className="w-full p-2 bg-[var(--primary-color)] text-white rounded-lg font-semibold"
                onClick={() => setConfirmed(true)}
              >
                Confirm
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center max-w-md w-full">
            <img
              src="/images/thankyou-order.png"
              alt="Thank You"
              className="h-[220px] mx-auto mb-4"
            />
            <h2 className="text-2xl font-semibold">Thank you! For The Order</h2>
            <p className="text-gray-600 mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <button
              className="flex-1 bb-sm-place-order-button w-full py-3 rounded-lg text-lg font-semibold flex justify-center items-center disabled:opacity-50 mt-8"
              onClick={() => setCurrentView("store")}
            >
              <ArrowLeft size={16} /> Back to Shop
            </button>
          </div>
        )}
      </div>
    );
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleSuggestedQuestionClick = (question: string) => {
    setPrompts(question);
    playHandler();
  };

  if (isAllowed === null) {
    return <div>Loading...</div>;
  }

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const HeaderNames: Record<string, string> = {
    store: "Chat",
    cart: "Checkout",
    feel: "Chat",
    chat: "Chat",
    new: "Chat",
    main: "Chat",
    checkOut: "Checkout",
    'product-type':'Product types'
    // Add more mappings as needed
  };

  const getViewName = (view: string): string => {
    return HeaderNames[view] || "";
  };

  return (
    <div className="bb-sm-chat-widget bb-sm-body">
      {true && (
        <div className="absolute right-2 bottom-14 flex justify-center items-center z-50 bb-sm-animate-open">
          <div className="bb-sm-chat-container p-0 pb-2 rounded-lg shadow-lg relative max-h-[calc(100vh-4rem)] overflow-hidden">
            <div className="md:flex md:flex-row flex-col gap-3 h-full max-h-full lg:min-w-[500px] p-2">
              {/* Chat area */}
              <div className="h-full w-full md:w-4/4 relative rounded-md p-2 flex flex-col overflow-hidden bb-sm-main-area">
                <div className="bb-sm-chat-header flex items-center justify-between">
                  <div className="flex">
                    <button
                      className={`bb-sm-hamburger-menu ${
                        isMenuOpen || currentView !== "main" ? "bb-sm-open" : ""
                      }`}
                      onClick={toggleMenu}
                    >
                      {currentView !== "chat" ? (
                        <FaArrowLeft />
                      ) : (
                        <>
                          {!isMenuOpen && (
                            <HiMiniBars3CenterLeft fontWeight={"bolder"} />
                          )}
                        </>
                      )}
                    </button>
                  </div>
                  <p className="p-1 text-[1.05rem] font-bold flex-1">
                    {getViewName(currentView || "")}
                  </p>
                  <div className="flex flex-row gap-5 justify-end items-center flex-1">
                    {/* <button 
                      className="px-5 p-1 bg-primary-color rounded"
                      onClick={()=>setCurrentView('chat')}><FaWandMagicSparkles color="white" /></button> */}
                    {Object.keys(cart).length > 0 && (
                    <div className="bg-primary-color text-white rounded text-base p-[6px]">
                      <button className="flex justify-between  whitespace-nowrap min-w-max" onClick={() => navigateTo("checkOut")}>
                        Checkout Now
                          <span className="bb-sm-cart-count self-center text-sm">
                            {Object.values(cart).reduce(
                              (sum, { product, quantity }) => sum + quantity,
                              0
                            )}
                          </span>
                        </button>
                      </div>
                    )}
                    <button
                      className="bb-sm-header-icon"
                      onClick={handleViewProductType}
                    >
                      <FaWandMagicSparkles size={20} />
                    </button>
                    <button
                      className="bb-sm-header-icon"
                      onClick={handleViewChat}
                    >
                      <FaHome size={20} />
                    </button>
                    {/* <div className="bb-sm-cart-icon-container bb-sm-header-icon">
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
                    </div> */}
                    {/* <button
                      className="bb-sm-close-button bb-sm-header-icon"
                      onClick={handleModalBox}
                    ></button> */}
                  </div>
                </div>
                {currentView === "main" && <MainView />}
                {currentView === "store" && <StoreView />}
                {currentView === "product-type" && <ProductType />}
                {currentView === "product" && (
                  <ProductDetailView product={selectedProduct} />
                )}
                {currentView === "feel" && (
                  <FeelingsScreen selectedProductType={selectedProductType} />
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
                {currentView === "order-confirm" && <OrderConfirmation />}
                {currentView === "events" && <EventList />}
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
                                  setPrompts("Show me Deals of the day")
                                }
                                onClick={() => playHandler()}
                              >
                                <span className="bb-sm-new-chat-button-icon">
                                  📦
                                </span>
                                Deals of the day
                              </button>
                              <button
                                className="bb-sm-new-chat-button"
                                onMouseDown={() =>
                                  setPrompts("Show me events near me")
                                }
                                onClick={() => playHandler()}
                              >
                                <span className="bb-sm-new-chat-button-icon">
                                  💰
                                </span>
                                <span className="bb-sm-new-chat-button-text">
                                  Events near me
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
                            onSuggestedQuestionClick={
                              handleSuggestedQuestionClick
                            }
                          />
                        </div>
                      )}
                    </>
                  ))}

                {(currentView == "store" ||
                  currentView == "chat" ||
                  currentView == "main") &&
                  isAllowed && (
                    <div className="bb-sm-chat-input">
                      {/* {chatHistory.length > 0 &&
                        !loading &&
                        chatHistory[chatHistory.length - 1]?.data
                          ?.suggested_next_questions && (
                          <div className="bb-sm-quick-responses-container">
                            {chatHistory[
                              chatHistory.length - 1
                            ]?.data?.suggested_next_questions?.map(
                              (question: string, index: number) => (
                                <button
                                  key={`quick-response-${index}`}
                                  className="bb-sm-quick-response-button"
                                  onClick={() =>
                                    handleSuggestedQuestionClick(question)
                                  }
                                >
                                  {question}
                                </button>
                              )
                            )}
                          </div>
                        )} */}
                      <textarea
                        className="resize-none w-full placeholder-text-secondary p-2 min-h-[40px] max-h-[120px] overflow-y-auto"
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
              <Sidebar
                isMenuOpen={isMenuOpen}
                isLoggedIn={isLoggedIn}
                chats={chats}
                activeChatId={activeChatId}
                onLoadChatHistory={loadChatHistory}
                onLogin={handleLogin}
                onViewSettings={handleViewSettings}
                onViewStore={handleViewStore}
                onRenameChat={handleRenameChat}
                onDeleteChat={handleDeleteChat}
                setIsMenuOpen={setIsMenuOpen}
              />

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
