import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProducts, addToCart, getCart } from "./api";
import "./App.css";

export default function CategoryPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const userLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getProducts();
        const filtered = allProducts.filter(p => p.category === category);
        setProducts(filtered);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchProducts();
  }, [category]);

  useEffect(() => {
    if (userLoggedIn) fetchCartItems();
  }, [userLoggedIn]);

  const fetchCartItems = async () => {
    try {
      const data = await getCart();
      setCartItems(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleAddToCart = async (id) => {
    if (!userLoggedIn) {
      alert("Please login first");
      return;
    }
    try {
      await addToCart(id);
      fetchCartItems();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="app-container">
      <h2>{category} Products</h2>
      <div className="products-grid">
        {products.map((p) => (
          <div className="product-card" key={p.id}>
            <div className="product-img-container">
              <img
                src={p.imageUrl || "https://source.unsplash.com/200x200/?product"}
                alt={p.name}
                className="product-img"
              />
            </div>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p className="price">₹{p.price}</p>
            <button className="btn btn-add" onClick={() => handleAddToCart(p.id)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
