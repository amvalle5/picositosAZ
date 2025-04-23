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

    // Empty Cart Display Logic
    const emptyCart = document.getElementById("empty-cart");
    const cartContainer = document.getElementById("cart-container");
    const cartItemsContainer = document.getElementById('cart-items');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the cart is empty and display accordingly
    if (cart.length === 0) {
        emptyCart.style.display = "block";
        if (cartContainer) cartContainer.classList.add("hidden");
    } else {
        emptyCart.style.display = "none";
        if (cartContainer) cartContainer.classList.remove("hidden");

        // Render items in the cart
        cart.forEach(item => {
            const productDiv = document.createElement('div');
            productDiv.className = 'cart-item';
            productDiv.innerHTML = `
                <h4>${item.name}</h4>
                <p>Size: ${item.size}</p>
                <p>Quantity: ${item.quantity}</p>
                <hr>
            `;
            cartItemsContainer.appendChild(productDiv);
        });
    }

    // Add-to-cart button logic
    document.querySelectorAll('.product button[type="submit"]').forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.closest('.product').querySelector('h3').innerText;
            const size = button.closest('.product').querySelector('select[name="size"]').value;
            const quantity = parseInt(button.closest('.product').querySelector('input[name="quantity"]').value);

            const item = {
                name: productName,
                size: size,
                quantity: quantity
            };

            // Update cart in localStorage
            cart.push(item);
            localStorage.setItem('cart', JSON.stringify(cart));

            alert(`${item.quantity} ${item.size} ${item.name}(s) added to cart!`);
        });
    });
});
