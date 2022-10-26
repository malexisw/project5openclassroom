const url = "http://localhost:3000/api/products";

const fetchProducts = async () => {
  return await fetch(url).then((response) => response.json());
};

const createItems = (products) => {
  for (let i = 0; i < products.length; i++) {
    const items = document.querySelector("#items");

    const itemsLink = document.createElement("a");
    itemsLink.href = "./product.html?id=" + products[i]._id;

    const itemsArticles = document.createElement("ARTICLE");

    const itemsImg = document.createElement("img");
    itemsImg.src = products[i].imageUrl;
    itemsImg.alt = products[i].altTxt;

    const itemsH3 = document.createElement("h3");
    itemsH3.innerText = products[i].name;

    const itemsP = document.createElement("p");
    itemsP.innerText = products[i].description; 

    items.appendChild(itemsLink);
    itemsLink.appendChild(itemsArticles);
    itemsArticles.appendChild(itemsImg);
    itemsArticles.appendChild(itemsH3);
    itemsArticles.appendChild(itemsP);
  }
};

const createHTML = async () => {
  const products = await fetchProducts();
  createItems(products);
};

createHTML();
