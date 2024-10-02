import React from "react";
import Layout from "./components/Layout/Layout";
import ProductList from "./components/product/ProductList";
import call_api from "./helper/interact_api";
import { BASE_URL } from "./constants/general";
import { getCookie } from "./helper/cookie";
import "./styles/main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Login from "./components/common/Login";
import NotFound404 from "./components/common/notFound404";
import LandingPage from "./components/common/LandingPage";
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
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Payment from "./components/common/Payment";

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [cartItem, setCartItem] = useState([]);
  const [error, setError] = useState(null);
  const [isLogged, setIsLogged] = useState();

  const url = BASE_URL + "api/orders/";
  const csrfToken = getCookie("csrftoken");
  const headers = {
    "Content-Type": "application/json",
    "X-CSRFToken": csrfToken,
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setIsLogged(false);
          return;
        }
        const { data, error, status } = await call_api(
          `${BASE_URL}account/check-auth`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
          true
        );
        if (error || status !== 200) {
          setIsLogged(false);
          return;
        }
        setIsLogged(data["isAuthenticated"]);
      } catch (error) {
        console.error("Error during authentication check:", error);
        setIsLogged(false);
      }
    };

    checkAuth();
  }, []);

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
        <Layout
          cartCount={cartCount}
          isLogged={isLogged}
          setIsLogged={setIsLogged}
        >
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
            <Route path="/payment" element={<Payment />} />
            <Route
              path="/login"
              element={<Login isLogged={isLogged} setIsLogged={setIsLogged} />}
            />

            <Route
              path="/product/category/:cat_slug/"
              element={<ProductCategoryList />}
            />

            <Route path="/products/:product_uuid" element={<ProductDetail />} />
            <Route path="/" element={<LandingPage />} />
            <Route
              path="*"
              element={<NotFound404 to="/notfound" replace={true} />}
            />
          </Routes>
        </Layout>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
