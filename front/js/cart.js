//Get data functions
const getCart = () => {
  if (localStorage.getItem("cart") !== null) {
    return JSON.parse(localStorage.getItem("cart"));
  }
  return null;
};

const fetchProduct = async (id) => {
  const url = "http://localhost:3000/api/products/" + id;
  return await fetch(url).then((response) => response.json());
};

//Create HTML functions
const createArticles = async (item) => {
  const product = await fetchProduct(item.id);

  const cartItems = document.getElementById("cart__items");

  const article = document.createElement("ARTICLE");
  article.className = "cart__item";
  article.setAttribute("data-id", item.id);
  article.setAttribute("data-color", item.color);

  const cartItemImg = document.createElement("div");
  cartItemImg.className = "cart__item__img";

  const img = document.createElement("img");
  img.src = product.imageUrl;
  img.alt = product.altTxt;

  const cartItemContent = document.createElement("div");
  cartItemContent.className = "cart__item__content";

  const cartItemContentDescription = document.createElement("div");
  cartItemContentDescription.className = "cart__item__content__description";

  const name = document.createElement("h2");
  name.innerText = product.name;

  const color = document.createElement("p");
  color.innerText = item.color;

  const price = document.createElement("p");
  price.innerText = product.price + " €";

  const cartItemContentSettings = document.createElement("div");
  cartItemContentSettings.className = "cart__item__content__settings";

  const cartItemContentSettingsQuantity = document.createElement("div");
  cartItemContentSettingsQuantity.className =
    "cart__item__content__settings__quantity";

  const pQte = document.createElement("p");
  pQte.innerText = "Qté : ";

  const inputNum = document.createElement("input");
  inputNum.type = "number";
  inputNum.className = "itemQuantity";
  inputNum.name = "itemQuantity";
  inputNum.min = 1;
  inputNum.max = 100;
  inputNum.value = item.quantity;

  const cartItemContentSettingsDelete = document.createElement("div");
  cartItemContentSettingsDelete.className =
    "cart__item__content__settings__delete";

  const removeProduct = document.createElement("p");
  removeProduct.innerText = "Supprimer";
  removeProduct.className = "deleteItem";

  cartItems.appendChild(article);
  article.appendChild(cartItemImg);
  cartItemImg.appendChild(img);
  article.appendChild(cartItemContent);
  cartItemContent.appendChild(cartItemContentDescription);
  cartItemContentDescription.appendChild(name);
  cartItemContentDescription.appendChild(color);
  cartItemContentDescription.appendChild(price);
  cartItemContent.appendChild(cartItemContentSettings);
  cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);
  cartItemContentSettingsQuantity.appendChild(pQte);
  cartItemContentSettingsQuantity.appendChild(inputNum);
  cartItemContentSettings.appendChild(cartItemContentSettingsDelete);
  cartItemContentSettingsDelete.appendChild(removeProduct);
};

const createTotalPrice = () => {
  calculPrice().then((price) => {
    const totalPrice = document.getElementById("totalPrice");
    totalPrice.innerText = price;
  });
};

//Utils function
const isDupplicate = (entry, newCart) => {
  return newCart.some((x) => entry.id == x.id && entry.color == x.color);
};

const addQuantity = (entry, arr) => {
  arr.forEach((x) => {
    if (x.id === entry.id && x.color === entry.color) {
      x.quantity = parseInt(x.quantity) + parseInt(entry.quantity);
      x.quantity = x.quantity.toString();
    }
  });
};

const delDupCart = () => {
  let newCart = [];
  for (const entry of cart) {
    if (!isDupplicate(entry, newCart)) {
      newCart.push(entry);
    } else {
      addQuantity(entry, newCart);
    }
  }
  return newCart;
};

const delProduct = (id) => {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      cart.splice(i, 1);
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  document.location.reload(true);
};

const calculPrice = async () => {
  let result = 0;
  for (let i = 0; i <= cart.length - 1; i++) {
    const product = await fetchProduct(cart[i].id);
    result += product.price * cart[i].quantity;
  }
  return result;
};

//App
const createCart = () => {
  createTotalPrice();

  cart.forEach((item) => {
    createArticles(item).then(() => {
      const removeProduct = document.getElementsByClassName("deleteItem");
      const removeProductArray = [...removeProduct];

      removeProductArray.forEach((btn) => {
        btn.addEventListener("click", function (e) {
          const productDelID = e.target.closest(".cart__item").dataset.id;
          const productDelColor = e.target.closest(".cart__item").dataset.color;
          cart.forEach((el, index) => {
            el.id === productDelID &&
              el.color === productDelColor &&
              cart.splice(index, 1);
          });
          localStorage.setItem("cart", JSON.stringify(cart));
          e.target.closest(".cart__item").remove();
        });
      });

      const changeQté = document.getElementsByClassName("itemQuantity");
      const changeQtéArray = [...changeQté];

      changeQtéArray.forEach((input) => {
        input.addEventListener("change", function (e) {
          const productID = e.target.closest(".cart__item").dataset.id;
          const productColor = e.target.closest(".cart__item").dataset.color;
          cart.forEach((el, index) => {
            if (el.id === productID && el.color === productColor) {
              cart[index].quantity = e.target.value.toString();
            }
          });
          localStorage.setItem("cart", JSON.stringify(cart));
          createTotalPrice();
        });
      });
    });
  });
};

var cart = getCart();
cart = delDupCart();
createCart();
