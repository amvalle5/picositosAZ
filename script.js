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
  
    // Add to Cart Logic
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
  
    addToCartButtons.forEach(button => {
      button.addEventListener('click', () => {
        const productName = button.dataset.product;
        const sizeSelect = button.previousElementSibling.previousElementSibling;
        const selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
        const size = selectedOption.value;
        const price = parseFloat(selectedOption.dataset.price);
        const quantityInput = button.previousElementSibling;
        const quantity = parseInt(quantityInput.value);
  
        const item = {
          id: `${productName}-${size}`,
          name: productName,
          size: size,
          price: price,
          quantity: quantity
        };
  
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existing = cart.find(i => i.id === item.id);
        if (existing) {
          existing.quantity += quantity;
        } else {
          cart.push(item);
        }
  
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${productName} (${size}) added to cart!`);
      });
    });
  
    // Cart Page Logic
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.getElementById("cart-container");
    const emptyCart = document.getElementById("empty-cart");
    const cartBody = document.getElementById("cart-body");
  
    function renderCart() {
      if (!cartContainer || !emptyCart || !cartBody) return; // Page might not have cart elements
  
      if (cart.length === 0) {
        emptyCart.style.display = "block";
        cartContainer.classList.add("hidden");
        return;
      }
  
      emptyCart.style.display = "none";
      cartContainer.classList.remove("hidden");
      cartBody.innerHTML = "";
  
      cart.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.name}</td>
          <td>${item.size}</td>
          <td><input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}"></td>
          <td>$${item.price.toFixed(2)}</td>
          <td class="subtotal">$${(item.price * item.quantity).toFixed(2)}</td>
          <td><button class="remove-item" data-id="${item.id}">❌</button></td>
        `;
        cartBody.appendChild(row);
      });
    }
  
    function updateQuantity(id, newQuantity) {
      const item = cart.find(i => i.id === id);
      if (item) {
        item.quantity = newQuantity;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      }
    }
  
    function removeItem(id) {
      const index = cart.findIndex(i => i.id === id);
      if (index !== -1) {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      }
    }
  
    if (cartBody) {
      cartBody.addEventListener("change", (e) => {
        if (e.target.classList.contains("quantity-input")) {
          const id = e.target.dataset.id;
          const newQuantity = parseInt(e.target.value);
          if (newQuantity > 0) {
            updateQuantity(id, newQuantity);
          }
        }
      });
  
      cartBody.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-item")) {
          const id = e.target.dataset.id;
          removeItem(id);
        }
      });
    }
  
    renderCart();
  });
  