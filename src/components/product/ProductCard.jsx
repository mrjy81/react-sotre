import React from "react";
import { BASE_URL } from "../../constants/general";
import { useState } from "react";
import "./../../styles/product_cards.css";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const product_line = product?.product_line[0]; // default product-line
  const product_images = product_line?.product_image.map(
    (img) => BASE_URL + img.image
  ); // images of default productLine in order

  const [currentImage, setCurrentImage] = useState(product_images?.[0]);
  return (
    <Link to={`/products/${product.uuid}/`} className="product-card">
      <img src={currentImage} alt="Product 1" />
      <h3>{product.name}</h3>
      <p>Description of Product 1</p>
    </Link>
  );
}
