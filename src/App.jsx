import React, { useState, useEffect } from "react"; 
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { getProducts, getCart, addToCart, register, login, logout } from "./api";
import "./App.css";
import Cart from "./Cart";
import Categories from "./Categories.jsx";
import CategoryPage from "./CategoryPage.jsx";

// Default category images
const defaultImages = {
  Men: "https://source.unsplash.com/200x200/?mens-fashion",
  Women: "https://source.unsplash.com/200x200/?women-fashion",
  Kids: "https://source.unsplash.com/200x200/?kids-fashion",
  Beauty: "https://source.unsplash.com/200x200/?makeup",
  Electronics: "https://source.unsplash.com/200x200/?electronics",
  Groceries: "https://source.unsplash.com/200x200/?groceries",
};

function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const userLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (userLoggedIn) fetchCart();
  }, [userLoggedIn]);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCartItems(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleAddToCart = async (id) => {
    if (!userLoggedIn) {
      setAuthMode("login");
      setShowAuth(true);
      return;
    }
    try {
      await addToCart(id);
      fetchCart();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    setCartItems([]);
    navigate("/");
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      if (authMode === "login") await login(email, password);
      else await register(name, email, password);

      setShowAuth(false);
      setName("");
      setEmail("");
      setPassword("");
      fetchCart();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <h1 className="logo">SmartKart</h1>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <div className="header-actions">
          <Link to="/cart" className="cart-btn">🛒 ({cartItems.length})</Link>
          {!userLoggedIn && (
            <>
              <button className="btn" onClick={() => { setAuthMode("login"); setShowAuth(true); }}>Login</button>
              <button className="btn btn-outline" onClick={() => { setAuthMode("register"); setShowAuth(true); }}>Register</button>
            </>
          )}
          {userLoggedIn && <button className="btn btn-logout" onClick={handleLogout}>Logout</button>}
        </div>
      </header>

      {/* Categories */}
      <Categories />

      {/* Auth Modal */}
      {showAuth && (
        <div className="auth-modal">
          <div className="auth-content">
            <h2>{authMode === "login" ? "Login" : "Register"}</h2>
            <form onSubmit={handleAuthSubmit}>
              {authMode === "register" && (
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              )}
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit" className="btn btn-submit">{authMode === "login" ? "Login" : "Register"}</button>
            </form>
            <button className="close-btn" onClick={() => setShowAuth(false)}>×</button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="products-grid">
        {products.map((p) => (
          <div className="product-card" key={p.id}>
            <div className="product-img-container">
              <img
                src={p.imageUrl || defaultImages[p.category] || "https://source.unsplash.com/200x200/?product"}
                alt={p.name}
                className="product-img"
              />
            </div>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p className="price">₹{p.price}</p>
            <button className="btn btn-add" onClick={() => handleAddToCart(p.id)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// App with Router
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/category/:category" element={<CategoryPage />} />
      </Routes>
    </Router>
  );
}
