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
    const cartItems = [];
    const itemsList = document.getElementById("items");
    const subTotalSpan = document.getElementById("subTotal");
    const totalSpan = document.getElementById("total");
    const shippingSelect = document.getElementById("shipping-method");
    const cartMsg = document.getElementById("cartMsg");
  
    const TAX_RATE = 0.056;
    const SHIPPING_COST = 5;
  
    document.querySelectorAll(".add-to-cart").forEach(checkbox => {
      checkbox.addEventListener("change", function () {
        if (this.checked) {
          const productSection = this.closest(".product");
          const id = productSection.dataset.id;
          const name = productSection.dataset.name;
          const sizeSelect = productSection.querySelector(".size");
          const size = sizeSelect.value;
          const price = parseFloat(sizeSelect.selectedOptions[0].dataset.price);
          const quantity = parseInt(productSection.querySelector(".quantity").value);
  
          const item = {
            id,
            name,
            size,
            quantity,
            price,
          };
  
          cartItems.push(item);
  
          this.checked = false;
          updateCart();
        }
      });
    });
  
    shippingSelect.addEventListener("change", updateCart);
  
    function updateCart() {
      itemsList.innerHTML = "";
  
      if (cartItems.length === 0) {
        cartMsg.style.display = "list-item";
        subTotalSpan.textContent = "$0.00";
        totalSpan.textContent = "$0.00";
        return;
      } else {
        cartMsg.style.display = "none";
      }
  
      let subtotal = 0;
  
      cartItems.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} (${item.size}) x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
  
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.style.marginLeft = "10px";
        removeBtn.addEventListener("click", () => {
          cartItems.splice(index, 1);
          updateCart();
        });
  
        li.appendChild(removeBtn);
        itemsList.appendChild(li);
  
        subtotal += item.price * item.quantity;
      });
  
      const tax = subtotal * TAX_RATE;
      const shipping = shippingSelect.value === "shipping" ? SHIPPING_COST : 0;
      const total = subtotal + tax + shipping;
  
      subTotalSpan.textContent = `$${subtotal.toFixed(2)}`;
      totalSpan.textContent = `$${total.toFixed(2)}`;
    }
  });
  