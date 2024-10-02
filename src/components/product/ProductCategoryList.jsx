import React from "react";
import call_api from "../../helper/interact_api";
import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
export default function ProductCategoryList() {
  const { cat_slug } = useParams();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const url = `http://localhost:8000/api/product/category/${cat_slug}/all/`;
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error, status } = await call_api(url);
        if (error) {
          setError(error);
        } else {
          setProducts(data);
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProducts();
  }, [cat_slug]);
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="product-grid">
      {products?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
  return;
}
