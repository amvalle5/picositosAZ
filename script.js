document.addEventListener("DOMContentLoaded", () => {
  window.updateCart = updateCart;
  window.updateCartCountDisplay = updateCartCountDisplay;
  
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

  // -------- CART LOGIC --------

  // Load existing cart from localStorage or create a new empty array
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  const itemsList = document.getElementById("items");
  const subTotalSpan = document.getElementById("subTotal");
  const totalSpan = document.getElementById("total");
  const shippingSelect = document.getElementById("shipping-method");
  const cartMsg = document.getElementById("cartMsg");

  const TAX_RATE = 0.056;
  const SHIPPING_COST = 5;

  // Only if add-to-cart checkboxes exist on the page
  document.querySelectorAll(".add-to-cart").forEach(checkbox => {
    checkbox.addEventListener("change", function () {
      if (this.checked) {
        const productSection = this.closest(".product");
        const id = productSection.dataset.id;
        const name = productSection.dataset.name;
        const sizeSelect = productSection.querySelector(".size");
        const size = sizeSelect ? sizeSelect.value : "Default";
        const price = sizeSelect 
          ? parseFloat(sizeSelect.selectedOptions[0].dataset.price)
          : parseFloat(productSection.dataset.price);
        const quantityInput = productSection.querySelector(".quantity");
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

        const item = {
          id,
          name,
          size,
          quantity,
          price,
        };

        const existingItem = cartItems.find(i => i.id === id && i.size === size);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cartItems.push(item);
        }

        // Save updated cart to localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        this.checked = false;

        // Show the toast notification
        showToast(`${name} added to cart!`);

        // If on cart page, update the visible cart
        if (itemsList) {
          updateCart();
        }
        updateCartCountDisplay();
      }
    });
  });

  // If shipping option changes, update cart
  if (shippingSelect) {
    shippingSelect.addEventListener("change", updateCart);
  }

  // Function to update the cart display
  function updateCart() {
    itemsList.innerHTML = "";
  
    if (cartItems.length === 0) {
      const emptyMessage = document.createElement("li");
      emptyMessage.id = "cartMsg";
      emptyMessage.textContent = "Your Cart is Empty";
      itemsList.appendChild(emptyMessage);
  
      subTotalSpan.textContent = "$0.00";
      totalSpan.textContent = "$0.00";
      
      updateCartCountDisplay();
      return;
    }
  
    let subtotal = 0;
  
    cartItems.forEach((item, index) => {
      const li = document.createElement("li");
      li.textContent = `${item.name} (${item.size}) x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
  
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.classList.add("remove-button");
      removeBtn.addEventListener("click", () => {
        cartItems.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCart();
      });
  
      li.appendChild(removeBtn);
      itemsList.appendChild(li);
  
      subtotal += item.price * item.quantity;
    });
  
    const tax = subtotal * TAX_RATE;
    const shipping = shippingSelect && shippingSelect.value === "shipping" ? SHIPPING_COST : 0;
    const total = subtotal + tax + shipping;
  
    subTotalSpan.textContent = `$${subtotal.toFixed(2)}`;
    totalSpan.textContent = `$${total.toFixed(2)}`;
  
    updateCartCountDisplay();
  }  
  

  // If on cart page, initialize cart display
  if (itemsList) {
    updateCart();
  }

  // Function to show the toast notification
  function showToast(message) {
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.textContent = message;
    
    document.body.appendChild(toast);

    // Trigger the show animation
    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    // Remove the toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.remove();
      }, 500); 
    }, 3000);
  }

  function getCartItemCount() {
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    let total = 0;
    cart.forEach(item => {
      total += parseInt(item.quantity);
    });
    return total;
  }
  
  function updateCartCountDisplay() {
    const countEl = document.querySelector('.cart-count');
    const itemCount = getCartItemCount();
    if (countEl) {
      countEl.textContent = itemCount;
      countEl.style.display = itemCount > 0 ? 'inline-block' : 'none';
    }
  }
  
  updateCartCountDisplay();  


  //Checkout message and resetting of cart
  // document.getElementById("checkOut").addEventListener("click", function () {
  //   if (cartItems.length > 0) {
  //     const popup = document.getElementById("orderPopup");
  //     popup.classList.add("show");
  
  //     // ✅ Clear cart: both in-memory and in localStorage
  //     cartItems.length = 0;
  //     localStorage.removeItem('cartItems');
  
  //     // ✅ Immediately update UI
  //     updateCart();              
  //     updateCartCountDisplay();  
  
  //     // Hide popup after 3 seconds
  //     setTimeout(() => {
  //       popup.classList.remove("show");
  //     }, 3000);
  //   } else {
  //     alert("Your cart is empty!");
  //   }
  // });  
  const checkOutBtn = document.getElementById("checkOut");

if (checkOutBtn) {
  checkOutBtn.addEventListener("click", function () {
    if (cartItems.length > 0) {
      const popup = document.getElementById("orderPopup");
      popup.classList.add("show");

      cartItems.length = 0;
      localStorage.removeItem('cartItems');

      updateCart();
      updateCartCountDisplay();

      setTimeout(() => {
        popup.classList.remove("show");
      }, 3000);
    } else {
      alert("Your cart is empty!");
    }
  });
}

  
});
