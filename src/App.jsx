import React from "react";
import Layout from "./components/Layout/Layout";
import ProductList from "./components/product/ProductList";
import call_api from "./helper/interact_api";
import { BASE_URL } from "./constants/general";
import { getCookie } from "./helper/cookie";
import "./styles/main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProductDetail from "./components/product/ProductDetail";
import AppContext from "./context/AppContext";
import Cart from "./components/cart/Cart";
import ProductCategoryList from "./components/product/ProductCategoryList";

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [cartItem, setCartItem] = useState([]);
  const [error, setError] = useState(null);

  const url = BASE_URL + "api/orders/";
  const csrfToken = getCookie("csrftoken");
  const headers = {
    "Content-Type": "application/json",
    "X-CSRFToken": csrfToken,
  };

  const handleAddToCart = async (product_id) => {
    if (!cartItem.includes(product_id)) {
      const { data, error, status } = await call_api(url, {
        method: "POST",
        data: { product_id: product_id },
        headers: headers,
        withCredentials: true,
      });
      if (status === 201) {
        setCartCount(cartCount + 1);
        setCartItem([...cartItem, product_id]);
      }
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error, status } = await call_api(url, {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        });
        if (error) {
          setError(error);
        } else {
          setCartItem([...data]);
          setCartCount(data.length);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProducts();
  }, []);

  return (
    <AppContext.Provider value={{ handleAddToCart }}>
      <Router>
        <Layout cartCount={cartCount}>
          <Routes>
            <Route
              path="/cart"
              element={
                <Cart
                  setCartQty={setCartCount}
                  setCartItems={setCartItem}
                  cartItem={cartItem}
                  cartCount={cartCount}
                />
              }
            />
            <Route path="/products" element={<ProductList />} />

            <Route
              path="/product/category/:cat_slug/"
              element={<ProductCategoryList />}
            />

            <Route path="/products/:product_uuid" element={<ProductDetail />} />
            <Route
              path="*"
              element={<Navigate to="/products" replace={true} />}
            />
          </Routes>
        </Layout>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
