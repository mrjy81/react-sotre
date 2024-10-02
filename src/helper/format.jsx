export const formatMoney = (money = 0) => {
  // Convert the input to a string and split it into integer and decimal parts
  const [integerPart, decimalPart] = money.toString().split(".");

  // Add commas to the integer part
  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );

  // Combine the formatted integer part with the decimal part (if it exists)
  return decimalPart
    ? `${formattedIntegerPart}.${decimalPart}`
    : formattedIntegerPart;
};
