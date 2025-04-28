document.addEventListener("DOMContentLoaded", () => {
  // FAQ Logic
  const questions = document.querySelectorAll(".faq-question");

  questions.forEach(question => {
      question.addEventListener("click", () => {
          question.classList.toggle("active");
          const answer = question.nextElementSibling;
          const icon = question.querySelector(".icon");

          if (answer.style.display === "block") {
              answer.style.display = "none";
              icon.textContent = "+";
          } else {
              answer.style.display = "block";
              icon.textContent = "-";
          }
      });
  });

  // Function to add an item to cart
  function addToCart(product) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      // Check if item already exists in cart
      const existingProduct = cart.find(item => item.name === product.name && item.size === product.size);

      if (existingProduct) {
          existingProduct.quantity += 1; // Increment the quantity
      } else {
          product.quantity = 1; // Start with 1 if not in the cart
          cart.push(product);
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      alert("Added to cart!");
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartBody = document.getElementById("cart-body");
  const cartContainer = document.getElementById("cart-container");
  const emptyCart = document.getElementById("empty-cart");

  if (cart.length === 0) {
      cartContainer.classList.add("hidden");
      emptyCart.classList.remove("hidden");
  } else {
      cartContainer.classList.remove("hidden");
      emptyCart.classList.add("hidden");

      cart.forEach((item, index) => {
          const row = document.createElement("tr");

          row.innerHTML = `
              <td>${item.name}</td>
              <td>${item.size}</td>
              <td>
                  <button class="decrease" data-index="${index}">-</button>
                  <span class="quantity">${item.quantity}</span>
                  <button class="increase" data-index="${index}">+</button>
              </td>
              <td>$${item.price.toFixed(2)}</td>
              <td>$${(item.price * item.quantity).toFixed(2)}</td>
              <td><button class="remove-btn" data-index="${index}">Remove</button></td>
          `;

          cartBody.appendChild(row);
      });
  }

  // Remove item logic
  document.querySelectorAll(".remove-btn").forEach(button => {
      button.addEventListener("click", (e) => {
          const index = e.target.getAttribute("data-index");
          removeFromCart(index);
      });
  });

  // Update quantity logic
  document.querySelectorAll(".increase").forEach(button => {
      button.addEventListener("click", (e) => {
          const index = e.target.getAttribute("data-index");
          updateQuantity(index, 1); // Increase quantity by 1
      });
  });

  document.querySelectorAll(".decrease").forEach(button => {
      button.addEventListener("click", (e) => {
          const index = e.target.getAttribute("data-index");
          updateQuantity(index, -1); // Decrease quantity by 1
      });
  });

  function updateQuantity(index, change) {
      const cart = JSON.parse(localStorage.getItem("cart"));
      const item = cart[index];
      if (item.quantity + change > 0) { // Prevent negative quantities
          item.quantity += change;
          localStorage.setItem("cart", JSON.stringify(cart));
          location.reload(); // Refresh to update the cart
      }
  }

  function removeFromCart(index) {
      const cart = JSON.parse(localStorage.getItem("cart"));
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      location.reload(); // Refresh the page to update the cart
  }
});
