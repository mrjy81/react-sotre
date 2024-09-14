import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./../../styles/product_detail.css";
import { useContext } from "react";
import AppContext from "../../context/AppContext";
import { BASE_URL } from "../../constants/general";
import call_api from "../../helper/interact_api";
import { COLORS } from "../../constants/colors";

export default function ProductDetail() {
  const { product_uuid } = useParams();
  const location = useLocation();
  const { state } = location;
  const { handleAddToCart } = useContext(AppContext);
  const url = BASE_URL + `api/product/${product_uuid}`;
  const [product, setProduct] = useState();
  const [currentImage, setCurrentImage] = useState();
  const [image_set, setImages] = useState([]);
  const [size, setSize] = useState({});
  const [price, setPrice] = useState({});
  const [currentProductline, setCurrentProductLine] = useState();

  const getProductLineKey = (value, obj) => {
    for (const [obj_key, obj_value] of Object.entries(obj)) {
      if (value === obj_value) return obj_key;
    }
  };

  const handleImageClick = (img) => setCurrentImage(img);
  const handleSelectSize = (event) => {
    const selectedSize = event.target.value;
    let pl = getProductLineKey(selectedSize, size);
    setCurrentProductLine(pl);
  };

  useEffect(() => {
    const getProduct = async () => {
      const { data, status } = await call_api(url);
      if (status === 200) {
        setProduct(data[0]);
      }
    };
    getProduct();
  }, []);

  let colors = [];
  let gender = [];
  let sizes = {};
  let prices = {};

  useEffect(() => {
    if (product) {
      colors = product.product_line.flatMap((pl) =>
        pl.attribute_values
          .filter((attrValue) => attrValue.attribute.name === "رنگ")
          .map((attrValue) => COLORS[attrValue.attribute_value] || null)
      );

      gender = product.product_line.flatMap((pl) =>
        pl.attribute_values
          .filter((attrValue) => attrValue.attribute.name === "جنسیت")
          .map((attrValue) => attrValue.attribute_value)
      );

      product.product_line.flatMap((pl) =>
        pl.attribute_values
          .filter((attrValue) => attrValue.attribute.name === "سایز")
          .map((attrValue) => (sizes[pl.id] = attrValue.attribute_value))
      );
      setSize({ ...sizes });

      product.product_line.map((pl) => (prices[pl.id] = pl.price));
      setPrice(prices);

      let newImages = [];
      let product_line = product.product_line;
      for (let i = 0; i < product_line.length; i++) {
        let image_set = product_line[i].product_image;
        for (let j = 0; j < image_set.length; j++) {
          newImages.push(BASE_URL + image_set[j].image);
        }
      }
      setImages(newImages);
      setCurrentImage(newImages[0]);
      setCurrentProductLine(product_line[0].id);
    }
  }, [product]);

  return (
    <>
      <div className="pagination">
        <p>Home Shop Women Jacket </p>
      </div>
      <section className="product-container">
        <div className="img-card">
          <img src={currentImage} alt="" id="featured-image" />
          <div className="small-Card">
            {image_set.map((img, index) => (
              <img
                key={index}
                src={img}
                alt=""
                className="small-Img"
                onClick={() => handleImageClick(img)}
              />
            ))}
          </div>
        </div>
        <div className="product-info">
          <h3>{product?.name}</h3>
          <h5>قیمت: {price[currentProductline]}</h5>
          <p>{product?.description}</p>
          {Object.keys(size).length ? (
            <div className="sizes">
              <p>اندازه:</p>
              <select
                name="Size"
                id="size"
                className="size-option"
                onChange={handleSelectSize}
              >
                {Object.entries(size).map(([key, value]) => (
                  <option key={key}>{value}</option>
                ))}
              </select>
            </div>
          ) : undefined}

          <div className="quantity">
            <button onClick={() => handleAddToCart(currentProductline)}>
              Add to Cart
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
