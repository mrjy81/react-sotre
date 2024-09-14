import axios from "axios";

export default async function call_api(url, options = {}) {
  // Default options
  const defaultOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Merge default options with provided options
  const mergedOptions = { ...defaultOptions, ...options };
  try {
    const response = await axios({
      url,
      ...mergedOptions,
    });

    return { data: response.data, status: response.status };
  } catch (error) {
    // Handle any errors
    console.error("Axios error:", error);

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        error: error.response.data,
        status: error.response.status,
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        error: "No response received",
        status: 500,
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        error: error.message,
        status: 500,
      };
    }
  }
}
