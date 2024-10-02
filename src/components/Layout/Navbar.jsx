import React, { useState } from "react";
import "./../../styles/navbar.css";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../constants/general";
import call_api from "../../helper/interact_api";
import { useEffect } from "react";
export default function Navbar({ cartCount, setIsLogged, isLogged }) {
  const url = BASE_URL + "api/category/";
  const [categories, setCategories] = useState();
  const [sortedCategories, setSortedCategories] = useState({});

  const getCategoryById = (id, arr) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id == id) {
        return { category: arr[i].category, slug: arr[i].slug };
      }
    }
    return null;
  };

  useEffect(() => {
    const getCategories = async () => {
      const { data, status } = await call_api(url);
      if (status === 404) {
        console.log("not found");
        return;
      }
      if (status === 200) {
        setCategories(data);
        let category = {};
        for (let i = 0; i < data.length; i++) {
          if (data[i].parent == null) category[data[i].id] = [];
          else category[data[i].parent]?.push(data[i]);
        }
        setSortedCategories(category);
      }
    };
    getCategories();
  }, []);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const accessToken = localStorage.getItem("accessToken");

      if (!refreshToken || !accessToken) {
        console.warn("No tokens found. User might already be logged out.");
        return;
      }

      const { data, error, status } = await call_api(`${BASE_URL}logout/`, {
        method: "POST",
        data: { refresh_token: refreshToken },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (error || status !== 205) {
        console.log(`Logout failed with status ${status}: ${error}`);
      }
    } catch (error) {
      console.error("Logout failed:", error.message);
    } finally {
      // Always remove tokens, even if the API call fails
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setIsLogged(false);
    }
  };

  let loggin_btn = (
    <Link className="nav-link" to="/login">
      ورود
    </Link>
  );

  let loggout_btn = (
    <a className="nav-link" onClick={handleLogout}>
      خروج
    </a>
  );

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid d-flex justify-content-between">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarExampleOnHover"
          aria-controls="navbarExampleOnHover"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarExampleOnHover">
          <ul className="navbar-nav me-auto ps-lg-0">
            <li className="nav-item dropdown dropdown-hover position-static">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                دسته بندی
              </a>
              <div
                className="dropdown-menu w-100 mt-0"
                aria-labelledby="navbarDropdown"
              >
                <div className="container">
                  <div className="row my-4">
                    <Link className="nav-link" to="/products">
                      همه
                    </Link>
                    {Object.entries(sortedCategories).map(([key, value]) => (
                      <div key={key} className="col-md-6 col-lg-3 mb-3 mb-lg-0">
                        <Link
                          to={`product/category/${
                            getCategoryById(key, categories).slug
                          }/`}
                          className="dropdown-item"
                        >
                          <h5>{getCategoryById(key, categories).category}</h5>
                        </Link>
                        <ul className="list-unstyled">
                          {value.map((cat) => (
                            <li key={cat.id}>
                              <Link
                                to={`product/category/${cat.slug}/`}
                                className="dropdown-item"
                              >
                                {cat.category}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </li>
            <li className="nav-item">{isLogged ? loggout_btn : loggin_btn}</li>
            <li className="nav-item">
              <Link className="nav-link" to="/">
                خانه
              </Link>
            </li>
          </ul>
        </div>
        <Link to="/cart">
          <div className="ms-auto">
            <i className="bi bi-cart"></i>
            <span className="badge rounded-pill bg-dark">{cartCount}</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
