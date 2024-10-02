import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../constants/general";
import call_api from "../../helper/interact_api";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

  console.log(state);

  const url = `${BASE_URL}api/orders/get-orders/`;
  useEffect(() => {
    const getOrders = async () => {
      const { data, status } = await call_api(url);
    };

    getOrders();
  }, []);
  return <div>Payment</div>;
}
