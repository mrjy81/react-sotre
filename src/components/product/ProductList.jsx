import React, { useEffect, useState } from "react";
import call_api from "../../helper/interact_api";
import ProductCard from "./ProductCard";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const url = "http://localhost:8000/api/product";

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
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
