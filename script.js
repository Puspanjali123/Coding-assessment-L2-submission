document.addEventListener("DOMContentLoaded", () => {
  const apiURL =
    "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889";
  const cartItemsContainer = document.getElementById("cart-item-list");
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");

  let cartData = [];

  fetch(apiURL)
    .then((response) => response.json())
    .then((data) => {
      cartData = data.items;
      displayCartItems(cartData);
      calculateTotals();
    })
    .catch((error) => console.error("Error fetching cart data:", error));

  function displayCartItems(cartItems) {
    cartItemsContainer.innerHTML = "";
    cartItems.forEach((item) => {
      const itemHTML = `
          <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.title}" class="product-image"/>
            <div class="item-details">
              <p class="item-title">${item.title}</p>
              <p class="item-price">₹${item.price.toFixed(2)}</p>
              <input type="text" class="item-quantity" value="${
                item.quantity
              }" min="1"/>
              <p class="item-subtotal">₹${(item.price * item.quantity).toFixed(
                2
              )}</p>
              <button class="remove-item"><img src="./assets/ant-design_delete-filled.png" alt=""></button>
            </div>
          </div>
        `;
      cartItemsContainer.innerHTML += itemHTML;
    });

    document.querySelectorAll(".item-quantity").forEach((input) => {
      input.addEventListener("change", updateQuantity);
    });
    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", removeItem);
    });
  }

  function updateQuantity(event) {
    const input = event.target;
    const itemId = input.closest(".cart-item").dataset.id;
    const newQuantity = parseInt(input.value, 10);

    const item = cartData.find((item) => item.id === itemId);
    item.quantity = newQuantity;
    input.nextElementSibling.textContent = `₹${(
      item.price * item.quantity
    ).toFixed(2)}`;

    calculateTotals();
  }

  function removeItem(event) {
    const button = event.target;
    const cartItem = button.closest(".cart-item");
    const itemId = cartItem.dataset.id;

    cartData = cartData.filter((item) => item.id !== itemId);

    cartItem.remove();

    calculateTotals();
  }

  function calculateTotals() {
    let subtotal = 0;
    cartData.forEach((item) => {
      subtotal += item.price * item.quantity;
    });

    subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    totalElement.textContent = `₹${subtotal.toFixed(2)}`;
  }

  document.getElementById("checkout-btn").addEventListener("click", () => {
    alert("Proceeding to checkout...");
  });
});
