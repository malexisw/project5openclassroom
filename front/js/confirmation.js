const baseUrl = window.location.href;
const id = baseUrl.substring(baseUrl.lastIndexOf("=") + 1);

const orderId = document.getElementById("orderId");
orderId.textContent = id;
localStorage.removeItem("cart");
