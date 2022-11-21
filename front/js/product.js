const baseUrl = window.location.href;
const id = baseUrl.substring(baseUrl.lastIndexOf("=") + 1);
const url = "http://localhost:3000/api/products/" + id;

// Fetch the  products of the API
const fetchProduct = async () => {
  return await fetch(url).then((response) => response.json());
};

// Create the HTML elements for the product
const createProduct = (product) => {
  const imgContainer = document.getElementsByClassName("item__img")[0];
  const img = document.createElement("img");
  img.src = product.imageUrl;
  img.alt = product.altTxt;
  imgContainer.appendChild(img);

  const title = document.getElementById("title");
  title.innerText = product.name;

  const price = document.getElementById("price");
  price.innerText = product.price;

  const description = document.getElementById("description");
  description.innerText = product.description;

  const colors = document.getElementById("colors");

  product.colors.forEach((color) => {
    const optionColor = document.createElement("option");
    optionColor.value = color;
    optionColor.innerText = color;

    colors.appendChild(optionColor);
  });
};

// Create the page
const createHTML = async () => {
  const product = await fetchProduct();
  createProduct(product);
};

// Add item to cart (localStorage) 
const addToCart = async () => {
  const id = baseUrl.substring(baseUrl.lastIndexOf("=") + 1);
  const quantity = document.getElementById("quantity").value;
  const color = document.getElementById("colors").value;

  console.log(color);

  if (color && quantity > 0) {
    let currentCart = [];
    if (localStorage.getItem("cart") !== null) {
      currentCart = JSON.parse(localStorage.getItem("cart"));
    }

    const cartProduct = {
      id: id,
      quantity: quantity,
      color: color,
    };

    currentCart.push(cartProduct);

    localStorage.setItem("cart", JSON.stringify(currentCart));

    location.href = "http://127.0.0.1:5500/front/html/index.html";
  }
};

createHTML();

document.getElementById("addToCart").addEventListener("click", function () {
  addToCart();
});
