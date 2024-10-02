import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./../../styles/product_detail.css";
import { useContext } from "react";
import AppContext from "../../context/AppContext";
import { BASE_URL } from "../../constants/general";
import call_api from "../../helper/interact_api";
import { COLORS } from "../../constants/colors";
import { formatMoney } from "../../helper/format";

export default function ProductDetail() {
  const { product_uuid } = useParams();
  const { handleAddToCart } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [image_set, setImages] = useState([]);
  const [size, setSize] = useState({});
  const [price, setPrice] = useState({});
  const [currentProductline, setCurrentProductLine] = useState(null);
  const [currentProductLineColors, setCurrentProductLineColors] = useState({});

  const getProductLineAttributeValue = useCallback((value, obj) => {
    return obj[value];
  }, []);

  const getProductLineById = useCallback(
    (pl_id) => {
      return product?.product_line.find((pl) => pl.id == pl_id);
    },
    [product]
  );

  const getColorsOfProductLine = useCallback(
    (pl) => {
      const colors = {};
      pl.forEach((plId) => {
        const productLine = getProductLineById(plId);
        const colorAttribute = productLine?.attribute_values.find(
          (av) => av.attribute.name === "رنگ"
        );
        if (colorAttribute) {
          colors[plId] = COLORS[colorAttribute.attribute_value];
        }
      });
      return colors;
    },
    [getProductLineById]
  );

  const handleImageClick = useCallback((img) => setCurrentImage(img), []);

  const handleSelectSize = useCallback(
    (event) => {
      const selectedSize = event.target.value;
      const pl = getProductLineAttributeValue(selectedSize, size);
      setCurrentProductLine(getProductLineById(pl[0]));
      setCurrentProductLineColors(getColorsOfProductLine(pl));
    },
    [
      getProductLineAttributeValue,
      size,
      getProductLineById,
      getColorsOfProductLine,
    ]
  );

  useEffect(() => {
    const getProduct = async () => {
      const { data, status } = await call_api(
        BASE_URL + `api/product/${product_uuid}`
      );
      if (status === 200) {
        setProduct(data[0]);
      }
    };
    getProduct();
  }, [product_uuid]);

  useEffect(() => {
    if (product) {
      const sizes = {};
      const prices = {};

      product.product_line.forEach((pl) => {
        pl.attribute_values
          .filter((attrValue) => attrValue.attribute.name === "سایز")
          .forEach((attrValue) => {
            if (!sizes[attrValue.attribute_value]) {
              sizes[attrValue.attribute_value] = [];
            }
            sizes[attrValue.attribute_value].push(pl.id);
          });
        prices[pl.id] = pl.price;
      });

      setSize(sizes);
      setPrice(prices);

      const newImages = product.product_line.flatMap((pl) =>
        pl.product_image.map((img) => BASE_URL + img.image)
      );

      setImages(newImages);
      setCurrentImage(newImages[0]);
      setCurrentProductLine(product.product_line[0]);

      // Set initial colors
      const initialProductLineIds = Object.values(sizes)[0] || [];
      setCurrentProductLineColors(
        getColorsOfProductLine(initialProductLineIds)
      );
    }
  }, [product, getColorsOfProductLine]);

  const changeProductLineByColor = useCallback(
    (pl_id) => {
      setCurrentProductLine(getProductLineById(pl_id));
    },
    [getProductLineById]
  );

  if (!product) return <div>Loading...</div>;

  return (
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
        <h3>{product.name}</h3>
        <h5>{formatMoney(price[currentProductline?.id])} تومان</h5>
        <p>{product.description}</p>
        {Object.keys(size).length > 0 && (
          <div className="sizes">
            <p>اندازه:</p>
            <div className="custom-select">
              <select
                name="Size"
                id="size"
                className="size-option"
                onChange={handleSelectSize}
              >
                {Object.keys(size).map((key) => (
                  <option key={key}>{key}</option>
                ))}
              </select>
            </div>
          </div>
        )}
        <div className="color-picker my-5">
          {Object.entries(currentProductLineColors).map(
            ([color_key, color_value]) => (
              <div
                className={`color-${color_value} color-option`}
                key={color_key}
                onClick={() => changeProductLineByColor(color_key)}
              ></div>
            )
          )}
        </div>
        <div className="quantity">
          <button onClick={() => handleAddToCart(currentProductline?.id)}>
            افزودن به سبد خرید
          </button>
        </div>
      </div>
    </section>
  );
}
