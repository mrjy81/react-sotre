import React from "react";
import { BASE_URL } from "../../constants/general";
import call_api from "../../helper/interact_api";
import { getCookie } from "../../helper/cookie";
import { useState, useEffect } from "react";
import "../../styles/cart.css";
import { formatMoney } from "../../helper/format";
export default function Cart({
  setCartQty,
  setCartItems,
  cartItem,
  cartCount,
}) {
  const clear_url = BASE_URL + "api/orders/clear-cart/";
  const cart_items_url = BASE_URL + "api/orders/";

  const [products, setProducts] = useState([]);

  const csrfToken = getCookie("csrftoken");
  const headers = {
    "X-CSRFToken": csrfToken,
  };
  const handleClearCart = async () => {
    if (cartCount > 0) {
      const { data, status } = await call_api(clear_url, {
        method: "DELETE",
        headers: headers,
        withCredentials: true,
      });
      if (status === 200) {
        setCartQty(0);
        setCartItems([]);
      }
    }
  };

  useEffect(() => {
    const getCartProductLine = async () => {
      const { data, status } = await call_api(cart_items_url, {
        withCredentials: true,
      });
      if (status === 200) {
        console.log(data);

        setProducts(data);
      }
    };
    getCartProductLine();
  }, []);

  return (
    <>
      <section className="h-100">
        <div className="container h-100 py-5">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-10">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-normal mb-0">سبد شما</h3>
              </div>

              {products.map((pl) => (
                <div className="card rounded-3 mb-4" key={pl.id}>
                  <div className="card-body p-4">
                    <div className="row d-flex justify-content-between align-items-center">
                      <div className="col-md-2 col-lg-2 col-xl-2">
                        {pl.product_image[0] ? (
                          <img
                            src={BASE_URL + pl.product_image[0]?.image}
                            className="img-fluid rounded-3"
                            alt="Cotton T-shirt"
                          />
                        ) : undefined}
                      </div>
                      <div className="col-md-3 col-lg-3 col-xl-3">
                        <p className="lead fw-normal mb-2"></p>
                        <p>
                          <span className="text-muted">Size: </span>M
                          <span className="text-muted">Color: </span>Grey
                        </p>
                      </div>
                      <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
                        <button
                          data-mdb-button-init
                          data-mdb-ripple-init
                          className="btn btn-link px-2"
                        >
                          <i className="bi bi-dash"></i>
                        </button>

                        <input
                          id="form1"
                          min="0"
                          name="quantity"
                          type="number"
                          className="form-control form-control-sm"
                        />

                        <button
                          data-mdb-button-init
                          data-mdb-ripple-init
                          className="btn btn-link px-2"
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                      <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                        <h5 className="mb-0">{formatMoney(pl.price)} تومان</h5>
                      </div>
                      <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                        <a href="#!" className="text-danger">
                          <i className="bi bi-trash"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="card">
                <div className="card-body">
                  <button
                    type="button"
                    data-mdb-button-init
                    data-mdb-ripple-init
                    className="btn btn-warning btn-block btn-lg"
                  >
                    ادامه
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {cartCount > 0 ? (
        <div className="d-grid gap-2 d-md-block">
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleClearCart}
          >
            حذف سبد
          </button>
        </div>
      ) : null}
    </>
  );
}
