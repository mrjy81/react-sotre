import axios from "axios";
import { getCookie } from "./cookie";
import api from "./Auth";

export default async function call_api(url, options = {}, needsAuth = false) {
  // Default options
  const defaultOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Merge default options with provided options
  const mergedOptions = { ...defaultOptions, ...options };

  // If not a GET request, attach CSRF token
  if (mergedOptions.method !== "GET") {
    const csrfToken = getCookie("csrftoken");
    mergedOptions.headers = {
      ...mergedOptions.headers,
      "X-CSRFToken": csrfToken,
    };
  }

  try {
    let response;
    if (needsAuth === true) {
      response = await api({
        url,
        ...mergedOptions,
      });
    } else {
      response = await axios({
        url,
        ...mergedOptions,
      });
    }

    return { data: response.data, status: response.status };
  } catch (error) {
    // Handle errors
    if (error.response) {
      return {
        error: error.response.data,
        status: error.response.status,
      };
    } else if (error.request) {
      return {
        error: "No response received",
        status: 500,
      };
    } else {
      return {
        error: error.message,
        status: 500,
      };
    }
  }
}
