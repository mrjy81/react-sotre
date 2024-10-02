import React from "react";
import { BASE_URL } from "../../constants/general";
import call_api from "../../helper/interact_api";
import { useState, useEffect } from "react";
import "../../styles/cart.css";
import { formatMoney } from "../../helper/format";
import { ConfirmationModal } from "../common/ConfirmationModal";
import { Link } from "react-router-dom";
export default function Cart({
  setCartQty,
  setCartItems,
  cartItem,
  cartCount,
}) {
  const clear_url = BASE_URL + "api/orders/clear-cart/";
  const cart_items_url = BASE_URL + "api/orders/";

  const [products, setProducts] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [totalSum, setSum] = useState(0);

  const handleClearCart = async () => {
    if (cartCount > 0) {
      const { data, status } = await call_api(clear_url, {
        method: "DELETE",
      });
      if (status === 200) {
        setCartQty(0);
        setCartItems([]);
        setProducts([]);
      }
    }
  };

  useEffect(() => {
    const getCartProductLine = async () => {
      const { data, status } = await call_api(cart_items_url, {
        withCredentials: true,
      });
      if (status === 200) {
        setProducts(data);
        let qty = {};
        for (let i = 0; i < data.length; i++) {
          qty[data[i]?.id] = data[i]?.qty;
        }
        setInputValues(qty);
      }
    };
    getCartProductLine();
  }, []);

  const changeProductQty = (pl_id, n) => {
    // Find the productline and update its quantity
    const updatedProducts = products.map((pl) => {
      if (pl.id === pl_id) {
        // Return a new object with updated qty
        return {
          ...pl,
          qty: n,
        };
      }
      // Return the original productline if no change
      return pl;
    });

    // Set the updated products array to the state
    setProducts(updatedProducts);
  };

  const handleDeleteProduct = async (pl_id) => {
    const { data, status } = await call_api(`${cart_items_url}${pl_id}/`, {
      method: "DELETE",
      withCredentials: true,
    });
    if (status === 200) {
      setProducts(products.filter((pl) => pl.id !== pl_id));
      setCartQty(cartCount - 1);
    }
  };

  const saveIncreaseQty = async (pl_id) => {
    const { data, status } = await call_api(`${cart_items_url}add-cart-qty/`, {
      method: "POST",
      withCredentials: true,
      data: {
        "product-line-id": pl_id,
      },
    });
    return { data, status };
  };

  const saveDecreaseQty = async (pl_id) => {
    const { data, status } = await call_api(
      `${cart_items_url}decrease-cart-qty/`,
      {
        method: "POST",
        withCredentials: true,
        data: {
          "product-line-id": pl_id,
        },
      }
    );
    return { data, status };
  };

  const handleIncreaseProductLine = async (pl) => {
    const { data, status } = await saveIncreaseQty(pl.id);

    if (status === 201) {
      let stock_qty = pl.stock_qty;
      if (stock_qty > inputValues[pl.id]) {
        let new_qty = inputValues[pl.id] + 1;
        setInputValues((prevValues) => ({
          ...prevValues,
          [pl.id]: new_qty,
        }));
        changeProductQty(pl.id, new_qty);
      }
    }
  };

  const handleDecreaseProductLine = async (pl) => {
    const { data, status } = await saveDecreaseQty(pl.id);
    if (status === 201) {
      if (inputValues[pl.id] > 1) {
        let new_qty = inputValues[pl.id] - 1;
        setInputValues((prevValues) => ({
          ...prevValues,
          [pl.id]: new_qty,
        }));
        changeProductQty(pl.id, new_qty);
      }
    }
  };

  useEffect(() => {
    if (products) {
      let sum = 0;
      for (const pl of products) {
        sum += pl.price * pl.qty;
      }
      setSum(sum);
    }
  }, [products, inputValues]);

  const findSize = (attr_values) => {
    for (const av of attr_values) {
      if (av.attribute.name === "سایز") {
        return av.attribute_value;
      }
    }
  };

  return (
    <>
      {cartCount > 0 ? (
        <section className="h-100">
          <div className="container h-100 py-5">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-10">
                <div className="d-flex justify-content-between align-items-center mb-4 ">
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
                            <span className="text-muted">
                              {pl.product.name}
                            </span>
                            <br />
                            {findSize(pl.attribute_values) ? (
                              <span className="text-muted">
                                اندازه {findSize(pl.attribute_values)}
                              </span>
                            ) : undefined}
                          </p>
                        </div>
                        <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
                          <Link to={`/products/${pl.product.uuid}/`}>
                            <i className="bi bi-info-circle mx-lg-2"></i>
                          </Link>

                          <button
                            data-mdb-button-init
                            data-mdb-ripple-init
                            className="btn btn-link px-2"
                            onClick={() => handleDecreaseProductLine(pl)}
                          >
                            <i className="bi bi-dash"></i>
                          </button>

                          <input
                            id="form1"
                            min="0"
                            name="quantity"
                            type="number"
                            className="form-control form-control-sm"
                            value={inputValues[pl.id] || 1}
                            readOnly
                          />

                          <button
                            data-mdb-button-init
                            data-mdb-ripple-init
                            className="btn btn-link px-2"
                            onClick={() => handleIncreaseProductLine(pl)}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                        <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                          <h5 className="mb-0">
                            {formatMoney(pl.price)} تومان
                          </h5>
                        </div>
                        <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                          <a
                            href="#"
                            className="text-danger"
                            onClick={() => handleDeleteProduct(pl.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="card">
                  <div className="card-body">
                    <Link
                      className="btn btn-warning btn-block btn-lg text-center"
                      to="/payment"
                      state={inputValues}
                    >
                      ادامه
                    </Link>
                  </div>
                </div>
                <div>
                  <h3>{formatMoney(totalSum)} مجموع</h3>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <h2 className="text-center"> سبد شما خالی است</h2>
      )}
      {/* {cartCount > 0 ? (
        <div className="d-flex mx-auto">
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleClearCart}
          >
            حذف سبد
          </button>
        </div>
      ) : null} */}
    </>
  );
}
