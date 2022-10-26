//Functions
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

const isDupplicate = (entry, newCart) => {
  return newCart.some((x) => entry.id == x.id && entry.color == x.color);
};

const calculPrice = (quantity, price) => {
  return quantity * price;
};

const addQuantity = (entry, arr) => {
  arr.forEach((x) => {
    if (x.id === entry.id && x.color === entry.color) {
      x.quantity = parseInt(x.quantity) + parseInt(entry.quantity);
      x.quantity = x.quantity.toString();
    }
  });
};

const createCart = async (cart) => {
  let TTPrice = 0;
  let newCart = [];
  for (const entry of cart) {
    if (!isDupplicate(entry, newCart)) {
      newCart.push(entry);
    } else {
      addQuantity(entry, newCart);
    }
  }

  for (let i = 0; i <= newCart.length - 1; i++) {
    product = await fetchProduct(newCart[i].id);
    createArticles(product, newCart[i]);
    TTPrice += calculPrice(newCart[i].quantity, product.price);
  }

  const totalPrice = document.getElementById("totalPrice");
  totalPrice.innerHTML = TTPrice;

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

const changeQte = (e, cart, index) => {
  cart[index].quantity = e.target.value;
  localStorage.setItem("cart", JSON.stringify(cart));
  document.location.reload(true);
};

const createHTML = (cart) => {
  if (cart && cart.length) {
    createCart(cart).then((newCart) => {
      const delBtns = document.getElementsByClassName("deleteItem");
      const delBtnsArray = [...delBtns];

      delBtnsArray.forEach((item, index) => {
        item.addEventListener("click", function () {
          delProduct(newCart[index].id);
        });
      });

      const inputQté = document.getElementsByClassName("itemQuantity");
      const inputQtéArray = [...inputQté];

      inputQtéArray.forEach((item, index) => {
        item.addEventListener("change", function (e) {
          changeQte(e, newCart, index);
        });
      });
    });
  }
};

const createArticles = (product, item) => {
  //HTML elements
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
  name.innerHTML = product.name;

  const color = document.createElement("p");
  color.innerHTML = item.color;

  const price = document.createElement("p");
  price.innerHTML = product.price + " €";

  const cartItemContentSettings = document.createElement("div");
  cartItemContentSettings.className = "cart__item__content__settings";

  const cartItemContentSettingsQuantity = document.createElement("div");
  cartItemContentSettingsQuantity.className =
    "cart__item__content__settings__quantity";

  const pQte = document.createElement("p");
  pQte.innerHTML = "Qté : ";

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

  const pDel = document.createElement("p");
  pDel.innerHTML = "Supprimer";
  pDel.className = "deleteItem";

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
  cartItemContentSettingsDelete.appendChild(pDel);
};

// Calls
const cart = getCart();
createHTML(cart);

const order = document.getElementsByTagName("form")[0];
order.addEventListener("submit", (e) => {
  e.preventDefault();
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const email = document.getElementById("email").value;

  const firstNameError = document.getElementById("firstNameErrorMsg");
  const lastNameError = document.getElementById("lastNameErrorMsg");
  const addressError = document.getElementById("addressErrorMsg");
  const cityError = document.getElementById("cityErrorMsg");
  const emailError = document.getElementById("emailErrorMsg");

  //Création objet fiche client
  let contact = {
    firstName: firstName,
    lastName: lastName,
    address: address,
    city: city,
    email: email,
  };
  // si formulaire vide
  if (
    firstName === "" ||
    lastName === "" ||
    address === "" ||
    city === "" ||
    email === ""
  ) {
    alert("Champs du formulaires vident !");
    return;
  }
  // si données formulaires incorrect
  if (
    addressError == false ||
    cityError == false ||
    emailError == false ||
    firstNameError == false ||
    lastNameError == false
  ) {
    alert("Données du formulaires invalides !");
  } else {
    // si tout est ok
    //Tableau avec ID
    let products = cart.map((product) => product.id);

    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },

      body: JSON.stringify({ contact, products }),
    })
      .then((response) =>
        response.json().then((data) => {
          location.href = `confirmation.html?id=${data.orderId}`;
        })
      )
      .catch((error) => error);
  }
});
