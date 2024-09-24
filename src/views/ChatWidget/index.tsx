import React, { useEffect, useRef, useState, useCallback } from "react";
import bottom from "/images/Chatbot logo white background large-circle.png";
import botIcon from "/images/receiver.jpeg";
import product1 from "/images/product1.png";
import product2 from "/images/product2.png";
import sendIcon from "/images/send.png";
import axios from "axios";
import loadingIcon from "/images/loading-spinner-white.gif";
import Swal from "sweetalert2";
import ChatHistory from "../../components/ChatHistory";
import "./main.css";
import useAuth from "../../hooks/useAuth";
import { Chats } from "../../models/ChatModels";
import {
  getChats,
  getChatMessages,
  sendMessage,
  renameChat,
  deleteChat,
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
  FaEllipsisV,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa"; // Import the store icon and back arrow icon
import { BASE_URL } from "../../utils/api";
import SettingsPage from "./settings";
import { getThemeSettings } from "./api/renameChat";

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  headerColor: string;
  textColor: string;
  textHoverColor: string;
}

const Spinner: React.FC = () => (
  <div className="spinner">
    <div className="bounce1"></div>
    <div className="bounce2"></div>
    <div className="bounce3"></div>
  </div>
);

export const ChatWidget: React.FC = () => {
  const { displayName, photoURL, user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState(1);
  const [prompts, setPrompts] = useState<string>("");
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<
    { role: string; content: string }[]
  >([{ role: "assistant", content: "Hey, how can I help?" }]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNewChat, setIsNewChat] = useState(true);
  const [currentView, setCurrentView] = useState<
    "chat" | "store" | "product" | "settings"
  >("chat");
  const [selectedProduct, setSelectedProduct] = useState(null);
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

  const [settings, setSettings] = useState<ThemeSettings>({
    primaryColor: "#00A67D",
    secondaryColor: "#00766D",
    backgroundColor: "#1E1E1E",
    headerColor: "#2C2C2C",
    textColor: "#FFFFFF",
    textHoverColor: "#AAAAAA",
  });
  const applyTheme = (theme: ThemeSettings) => {
    const root = document.documentElement;
    root.style.setProperty("--primary-color", theme.primaryColor);
    root.style.setProperty("--secondary-color", theme.secondaryColor);
    root.style.setProperty("--background-color", theme.backgroundColor);
    root.style.setProperty("--header-color", theme.headerColor);
    root.style.setProperty("--text-color", theme.textColor);
    root.style.setProperty("--text-hover-color", theme.textHoverColor);
  };

  useEffect(() => {
    applyTheme(settings);
  }, [settings]);

  const handleViewSettings = () => {
    setCurrentView("settings");
    setIsMenuOpen(false);
  };

  const handleSettingsClose = () => {
    setCurrentView("chat");
  };

  const handleSettingsSave = (newSettings: ThemeSettings) => {
    setSettings(newSettings);
  };

  const handleProductClick = (product) => {
    setCurrentView("product");
    setSelectedProduct(product);
  };

  const handleBack = () => {
    setCurrentView("chat");
    setSelectedProduct(null);
  };
  const fetchChatMessages = useCallback(async () => {
    if (!currentChatId || chatHistory.length > 0) return;
    try {
      const token = await user!.getIdToken();
      const messages = await getChatMessages(token, currentChatId);
      setChatHistory(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  }, [currentChatId, user, chatHistory]);

  const fetchUserChats = useCallback(async () => {
    try {
      const token = await user!.getIdToken();
      const fetchedChats = await getChats(token);
      if (fetchedChats.length > 0) {
        setChats(fetchedChats);
      }
    } catch (error) {
      console.error("Error fetching user chats:", error);
    }
  }, [user]);

  const loadChatHistory = useCallback(
    async (chatId: string | null) => {
      setLoading(true);
      setCurrentView("chat");
      setIsMenuOpen(false);
      if (chatId === null) {
        setIsNewChat(true);
        fetchUserChats();
        setActiveChatId(null);
        setCurrentChatId(null);
        setChatHistory([
          { role: "assistant", content: "Hey, how can I help?" },
        ]);
      } else {
        setIsNewChat(false);
        setActiveChatId(chatId);
        setCurrentChatId(chatId);
        try {
          const token = await user!.getIdToken();
          const messages = await getChatMessages(token, chatId);
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

  const toggleMenu = () => {
    switch (currentView) {
      case "store":
        setCurrentView("chat");
        break;
      case "chat":
        setIsMenuOpen(!isMenuOpen);
        break;
      case "product":
        setCurrentView("store");
        break;
      default:
        setIsMenuOpen(!isMenuOpen);
        break;
    }
  };

  useEffect(() => {
    const fetchThemeSettings = async () => {
      const token = await user!.getIdToken();
      const settings = await getThemeSettings(token);
      if (settings) {
        setSettings(settings);
      }
    };
    fetchThemeSettings();
  }, [user]);

  const playHandler = async () => {
    if (!prompts || loading) return;
    setIsNewChat(false);
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { role: "user", content: prompts },
      { role: "assistant", content: "loading" },
    ]);
    setPrompts("");
    setLoading(true);
    try {
      const token = await user!.getIdToken();
      const response = await sendMessage(
        token,
        prompts,
        "voiceType",
        currentChatId
      );
      setChatHistory((prevHistory) => {
        const updatedHistory = [...prevHistory];
        updatedHistory[updatedHistory.length - 1].content = response.response;
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
  }, [chatHistory, loading, fetchChatMessages]);

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
        className="login-form flex flex-col gap-6 w-full max-w-md"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="login-input p-3 rounded bg-gray-700 text-white text-lg"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="login-input p-3 rounded bg-gray-700 text-white text-lg"
        />
        <button
          type="submit"
          className="login-button border-2 border-white rounded-md text-white p-3 text-lg hover:bg-white hover:text-gray-800 transition-colors"
        >
          Login
        </button>
        <div className="text-center text-white my-4 text-lg">or</div>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="google-login-button border-2 border-white rounded-md text-white p-3 text-lg flex items-center justify-center hover:bg-white hover:text-gray-800 transition-colors"
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
      const mainArea = document.querySelector(".main-area");
      const header = document.querySelector(".chat-header");
      const contextMenu = document.querySelector(".context-menu");
      const chatRenameInput = document.querySelector(".chat-rename-input");
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

  const handleViewStore = () => {
    setIsMenuOpen(false);
    setCurrentView("store");
  };

  const fetchProducts = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${BASE_URL}/products?retailers=8266&page=${page}&states=michigan`
      );
      setProducts(response.data.products);
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
      setProducts(response.data.products);
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
      const token = await user!.getIdToken();
      deleteChat(token, chatId);
      setChats(chats.filter((chat: any) => chat.chat_id !== chatId));
      setContextMenu(null);
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const handleSaveRename = async () => {
    if (!editingChatId || !newChatName.trim()) return;
    try {
      const token = await user!.getIdToken();
      renameChat(token, editingChatId, newChatName);
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

  const StoreView = () => (
    <div className="store-view">
      {/* <div className="filters pt-2 pb-2 color-black">
        <button className="text-sm">Happy</button>
        <button className="text-sm">$100-$500</button>
        <button className="text-sm">All types</button>
      </div> */}
      <div className="results-header p-2">
        <h2>Showing results "{totalProducts}"</h2>
        <button
          onClick={() => {
            setSearchQuery("");
            fetchProducts();
          }}
        >
          See all
        </button>
      </div>
      {error && (
        <div
          className="error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      {isLoading ? (
        <div className="loading-container flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="product-grid">
            {products?.map((product, index) => (
              <div className="product-item" key={index}>
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  className="pb-1 cursor-pointer"
                  onClick={() => handleProductClick(product)}
                />
                <h3
                  className="text-md font-semibold cursor-pointer mt-2"
                  onClick={() => handleProductClick(product)}
                >
                  {product.product_name}
                </h3>
                <p className="text-sm">${product.latest_price?.toFixed(2)}</p>
                <p className="text-sm mt-2">{product.description}</p>
                <button className="text-md add-to-cart-button p-1 mt-2 align-end">
                  Add to cart
                </button>
              </div>
            ))}
          </div>
          <div className="pagination flex justify-center items-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="pagination-button"
              aria-label="Previous page"
            >
              <FaChevronLeft />
            </button>
            <span className="mx-4">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className="pagination-button"
              aria-label="Next page"
            >
              <FaChevronRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
  interface ProductDetailProps {
    product?: {
      product_name: string;
      image_url: string;
      latest_price: number;
      description: string;
      thc: string;
      cbd: string;
      potency: string;
      effects: string[];
    } | null;
  }

  const ProductDetailView: React.FC<ProductDetailProps> = ({ product }) => {
    if (!product) {
      return null;
    }
    return (
      <div className="product-detail-view p-2">
        <div className="flex justify-center items-center pb-2 w-full rounded-md border-2 border-white mb-5">
          <img
            className="product-detail-image"
            src={product.image_url}
            alt={product.product_name}
          />
        </div>
        <div className="flex flex-row justify-between gap-2 pb-2">
          <h3 className="font-bold">{product.product_name}</h3>
          <p className="price">${product.latest_price?.toFixed(2)}</p>
        </div>
        <p className="pb-2">{product.description}</p>

        <div className="flex flex-row justify-around gap-2 pb-2 data-container">
          {product.thc && (
            <div className="flex flex-col justify-between gap-2 pb-2 text-center">
              <span className="font-bold">THC</span>
              <span className="text-md">{product.thc}</span>
            </div>
          )}
          {product.cbd && (
            <div className="flex flex-col justify-between gap-2 pb-2 text-center">
              <span className="font-bold">CBD</span>
              <span className="text-md">{product.cbd}</span>
            </div>
          )}
          {product.potency && (
            <div className="flex flex-col justify-between gap-2 pb-2 text-center">
              <span className="font-bold">Potency</span>
              <span className="text-md">{product.potency}</span>
            </div>
          )}
        </div>

        <button className="add-to-cart-button p-2 mt-10">Add To Cart</button>
      </div>
    );
  };
  return (
    <div className="chat-widget">
      <button className="border-none outline-0" onClick={handleModalBox}>
        <img src={bottom} className="w-10" alt="Open Chatbot" />
      </button>
      {isModalOpen && (
        <div className="absolute right-2 bottom-14 flex justify-center items-center z-50 animate-open">
          <div className="chat-container p-0 pb-2 rounded-lg shadow-lg relative max-h-[calc(100vh-4rem)] overflow-hidden">
            <div className="md:flex md:flex-row flex-col gap-3 h-full max-h-full lg:min-w-[500px]">
              {/* Chat area */}
              <div className="h-full w-full md:w-4/4 relative rounded-md p-2 flex flex-col gap-2 overflow-hidden main-area">
                <div className="chat-header">
                  <div className="flex flex-row gap-5 w-15">
                    <button
                      className={`hamburger-menu ${
                        isMenuOpen || currentView !== "chat" ? "open" : ""
                      }`}
                      onClick={toggleMenu}
                    >
                      <>
                        <div></div>
                        <div></div>
                        <div></div>
                      </>
                    </button>
                    <div className="w-5"> </div>
                  </div>
                  <p className="text-lg md:text-xl font-bold text-center">
                    {currentView === "store" ? "Store" : "Chat"}
                  </p>
                  <div className="flex flex-row gap-5 w-15 justify-end">
                    <button className="" onClick={handleViewStore}>
                      <FaStore size={20} />
                    </button>

                    <button
                      className="close-button"
                      onClick={handleModalBox}
                    ></button>
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

                {currentView === "chat" && (
                  <>
                    {isNewChat && (
                      <div className="new-chat-view flex-grow overflow-y-auto">
                        <img
                          src={bluntSmokey}
                          alt="Smokey Robot"
                          className="w-32 h-auto mb-4"
                        />
                        <h2 className="new-chat-title">What's up, bud?</h2>
                        <p className="new-chat-description">
                          I'm Smokey, your AI budtender. I'm here to help you
                          find the right strain for you.
                        </p>
                        <div className="new-chat-buttons">
                          <button
                            className="new-chat-button"
                            onMouseDown={() =>
                              setPrompts("Show me new products")
                            }
                            onClick={() => playHandler()}
                          >
                            <span className="new-chat-button-icon">📦</span>
                            See new products
                          </button>
                          <button
                            className="new-chat-button"
                            onMouseDown={() =>
                              setPrompts("Find a new location")
                            }
                            onClick={() => playHandler()}
                          >
                            <span className="new-chat-button-icon">📍</span>
                            Find new location
                          </button>
                          <button
                            className="new-chat-button"
                            onMouseDown={() =>
                              setPrompts("Recommend a relaxing strain")
                            }
                            onClick={() => playHandler()}
                          >
                            <span className="new-chat-button-icon">🧘</span>
                            Relaxing strain
                          </button>
                          <button
                            className="new-chat-button"
                            onMouseDown={() => setPrompts("Tell me about CBD")}
                            onClick={() => playHandler()}
                          >
                            <span className="new-chat-button-icon">🌿</span>
                            Learn about CBD
                          </button>
                        </div>
                      </div>
                    )}
                    {!isNewChat && (
                      <div className="chat-messages flex-grow overflow-y-auto">
                        <ChatHistory
                          chatHistory={chatHistory}
                          loading={loading}
                          chatEndRef={chatEndRef}
                        />
                      </div>
                    )}
                  </>
                )}

                {currentView !== "product" && (
                  <div className="chat-input">
                    <textarea
                      className="resize-none w-full placeholder-gray-400 bg-transparent text-white p-2 min-h-[40px] max-h-[120px] overflow-y-auto"
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
                            ".chat-input"
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
                      className="send-button"
                    >
                      {loading ? (
                        <img
                          src={loadingIcon}
                          className="w-5 h-5"
                          alt="Loading"
                        />
                      ) : (
                        <img src={sendIcon} className="w-5 h-5" alt="Send" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Side menu */}
              <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
                <div className="side-menu-header">
                  <div className="robot-icon-container">
                    <img
                      src={isLoggedIn ? robotIcon : notLoggedInIcon}
                      alt={isLoggedIn ? "Chat Bot" : "Not Logged In"}
                      className="robot-icon"
                    />
                  </div>
                  {isLoggedIn && (
                    <h2 className="chat-history-title">Chat history</h2>
                  )}
                  <button
                    className="settings-button"
                    onClick={() => loadChatHistory(null)}
                  >
                    New Chat
                  </button>
                </div>

                <div className="side-menu-content">
                  {isLoggedIn ? (
                    <div className="chat-history-scroll">
                      {chats.length > 0 ? (
                        chats.map(({ chat_id, name }: any, index) => (
                          <div
                            key={`${chat_id}-${index}`}
                            className="chat-item-container"
                          >
                            {editingChatId === chat_id ? (
                              <div className="chat-rename-input">
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
                              <div className="chat-item-wrapper">
                                <button
                                  onClick={() => loadChatHistory(chat_id)}
                                  className={`menu-item text-md ${
                                    activeChatId === chat_id ? "active" : ""
                                  }`}
                                >
                                  {name}
                                </button>
                                <button
                                  className="chat-options-button"
                                  onClick={(e) => handleContextMenu(e, chat_id)}
                                >
                                  <FaEllipsisV />
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
                    <div className="flex flex-col items-center justify-center h-full w-full p-4">
                      <h2 className="text-2xl font-bold mb-6 text-white">
                        Login to Chat
                      </h2>
                      <LoginForm onLogin={() => setIsLoggedIn(true)} />
                    </div>
                  )}
                </div>

                {isLoggedIn && (
                  <div className="side-menu-footer flex flex-row gap-2">
                    <button
                      className="settings-button"
                      onClick={handleViewSettings}
                    >
                      Settings
                    </button>
                    <button
                      className="settings-button"
                      onClick={handleViewStore}
                    >
                      Shop
                    </button>
                  </div>
                )}
              </div>

              {/* Right panel */}
              <div className="h-full w-full md:w-1/3 rounded-md p-2 flex flex-col justify-between gap-1 right-panel">
                <div className="panel-container product-info">
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
                <div className="panel-container desired-effects">
                  <h4>Desired Effect:</h4>
                  <div className="effects-icons">
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
                <div className="panel-container community-reviews">
                  <h4 className="text-center">Community Reviews</h4>

                  <div className="reviews-list">
                    {/* Add sample reviews here */}
                    <div className="review text-md">
                      <b>Awesome</b>
                      <br /> Smell is 10/10 Taste is 10/10 High is 20/10 Smell
                      is 10/10 Taste is 10/10 High is 20/10 fireeeeee
                    </div>
                    <div className="review text-md">
                      <b>Lives up to the hype</b>
                      <br />
                      I've been using BakedBot for a while now and it's been a
                      game changer for me. I HIGHLY 🚀🪂✈
                    </div>
                    <div className="review text-md">
                      <b>Really Strong</b>
                      <br /> Its actually 32.21% total cannabinoids It's not
                      36.37% or whatever it says on the description.
                    </div>
                    {/* Add more sample reviews as needed */}
                  </div>
                </div>
              </div>
            </div>
            <p className="chat-footer mb-2 h-0 p-0 text-sm text-center">
              Powered by BakedBot AI
            </p>
          </div>
        </div>
      )}
      {contextMenu && (
        <div
          className="context-menu"
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
