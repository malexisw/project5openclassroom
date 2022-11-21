const url = "http://localhost:3000/api/products";

// Fetch the  products of the API
const fetchProducts = async () => {
  return await fetch(url).then((response) => response.json());
};

// Create the HTML elements for one product
const createItems = (product) => {
  const items = document.querySelector("#items");

  const itemsLink = document.createElement("a");
  itemsLink.href = "./product.html?id=" + product._id;

  const itemsArticles = document.createElement("ARTICLE");

  const itemsImg = document.createElement("img");
  itemsImg.src = product.imageUrl;
  itemsImg.alt = product.altTxt;

  const itemsH3 = document.createElement("h3");
  itemsH3.innerText = product.name;

  const itemsP = document.createElement("p");
  itemsP.innerText = product.description;

  items.appendChild(itemsLink);
  itemsLink.appendChild(itemsArticles);
  itemsArticles.appendChild(itemsImg);
  itemsArticles.appendChild(itemsH3);
  itemsArticles.appendChild(itemsP);
};

// Create the page
const createHTML = async () => {
  const products = await fetchProducts();
  products.forEach((product) => {
    createItems(product);
  });
};

createHTML();
