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

// On change quantity update the quantity in the localStorage
const onChangeQty = (e) => {
  const productID = e.target.closest(".cart__item").dataset.id;
  const productColor = e.target.closest(".cart__item").dataset.color;
  cart.forEach((el, index) => {
    if (el.id === productID && el.color === productColor) {
      cart[index].quantity = e.target.value.toString();
    }
  });
  localStorage.setItem("cart", JSON.stringify(cart));
  createTotalPrice();
};

// On click the del button delete the item in the HTML elements && the localStorage
const onClickDel = (e) => {
  const productDelID = e.target.closest(".cart__item").dataset.id;
  const productDelColor = e.target.closest(".cart__item").dataset.color;
  cart.forEach((el, index) => {
    el.id === productDelID &&
      el.color === productDelColor &&
      cart.splice(index, 1);
  });
  localStorage.setItem("cart", JSON.stringify(cart));
  e.target.closest(".cart__item").remove();
  createTotalPrice();
};

// Create the HTML elements for one article of the cart
const createArticle = async (item) => {
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
  price.innerText = product.price + " ???";

  const cartItemContentSettings = document.createElement("div");
  cartItemContentSettings.className = "cart__item__content__settings";

  const cartItemContentSettingsQuantity = document.createElement("div");
  cartItemContentSettingsQuantity.className =
    "cart__item__content__settings__quantity";

  const pQte = document.createElement("p");
  pQte.innerText = "Qt?? : ";

  const inputNum = document.createElement("input");
  inputNum.type = "number";
  inputNum.className = "itemQuantity";
  inputNum.name = "itemQuantity";
  inputNum.min = 1;
  inputNum.max = 100;
  inputNum.value = item.quantity;
  inputNum.addEventListener("change", function (e) {
    onChangeQty(e);
  });

  const cartItemContentSettingsDelete = document.createElement("div");
  cartItemContentSettingsDelete.className =
    "cart__item__content__settings__delete";
  const removeProduct = document.createElement("p");
  removeProduct.innerText = "Supprimer";
  removeProduct.className = "deleteItem";
  removeProduct.addEventListener("click", function (e) {
    onClickDel(e);
  });

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

// Calcul the total price of the cart
const createTotalPrice = () => {
  calculPrice().then((price) => {
    const totalPrice = document.getElementById("totalPrice");
    totalPrice.innerText = price;
  });
};

// Looks if there is a dupplicate
const isDupplicate = (entry, newCart) => {
  return newCart.some((x) => entry.id == x.id && entry.color == x.color);
};

// Add quantity to product
const addQuantity = (entry, arr) => {
  arr.forEach((x) => {
    if (x.id === entry.id && x.color === entry.color) {
      x.quantity = parseInt(x.quantity) + parseInt(entry.quantity);
      x.quantity = x.quantity.toString();
    }
  });
};

// Delete cart's dupplicate if color && id are the same
const delDupCart = () => {
  let newCart = [];
  if (cart) {
    for (const entry of cart) {
      if (!isDupplicate(entry, newCart)) {
        newCart.push(entry);
      } else {
        addQuantity(entry, newCart);
      }
    }
  }

  return newCart;
};

// Delete one product
const delProduct = (id) => {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      cart.splice(i, 1);
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  document.location.reload(true);
};

// Calcul the price of one product
const calculPrice = async () => {
  let result = 0;
  for (let i = 0; i <= cart.length - 1; i++) {
    const product = await fetchProduct(cart[i].id);
    result += product.price * cart[i].quantity;
  }
  return result;
};

//Create the HTML elements for the cart
const createCart = () => {
  createTotalPrice();

  if (cart.length === 0) {
    document.getElementById("order").disabled = true;
  }

  cart &&
    cart.forEach((item) => {
      createArticle(item);
    });
};

var cart = getCart();
cart = delDupCart();
createCart();

//Order
const order = document.getElementById("order");

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const address = document.getElementById("address");
const city = document.getElementById("city");
const email = document.getElementById("email");

//Regex for the form
const regexName = new RegExp("[^p{L}s-]");
const regexAddress = new RegExp("[^0-9p{L},s-]");
const regexCity = new RegExp("[^p{L}s-]");
const regexMail = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

//Confirmation order
order.addEventListener("click", (e) => {
  e.preventDefault();

  const errorFN = document.getElementById("firstNameErrorMsg");
  const errorLN = document.getElementById("lastNameErrorMsg");
  const errorAddress = document.getElementById("addressErrorMsg");
  const errorCity = document.getElementById("cityErrorMsg");
  const errorMail = document.getElementById("emailErrorMsg");

  errorFN.textContent = "";
  errorLN.textContent = "";
  errorAddress.textContent = "";
  errorCity.textContent = "";
  errorMail.textContent = "";

  const testFirstName = regexName.test(firstName.value);
  const testLastName = regexName.test(lastName.value);
  const testAddress = regexAddress.test(address.value);
  const testEmail = regexMail.test(email.value);
  const testCity = regexCity.test(city.value);

  //Cr??ation objet fiche client
  let contact = {
    firstName: firstName.value,
    lastName: lastName.value,
    address: address.value,
    city: city.value,
    email: email.value,
  };

  // si formulaire vide
  if (
    firstName.value === "" &&
    lastName.value === "" &&
    address.value === "" &&
    city.value === "" &&
    email.value === ""
  ) {
    alert("Champs du formulaires vident !");
    return;
  }
  // si donn??es formulaires incorrect
  if (
    !testFirstName ||
    !testLastName ||
    !testAddress ||
    !testCity ||
    !testEmail
  ) {
    !testFirstName ? (errorFN.textContent = "Le champs est invalide") : null;
    !testLastName ? (errorLN.textContent = "Le champs est invalide") : null;
    !testAddress ? (errorAddress.textContent = "Le champs est invalide") : null;
    !testCity ? (errorCity.textContent = "Le champs est invalide") : null;
    !testEmail ? (errorMail.textContent = "Le champs est invalide") : null;
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
          console.log(data.orderId);
        })
      )
      .catch((error) => error);
  }
});
