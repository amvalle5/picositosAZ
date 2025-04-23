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

    // Cart Logic
    const emptyCart = document.getElementById("empty-cart");
    const cartContainer = document.getElementById("cart-container");
    const cartItemsContainer = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        emptyCart.style.display = "block";
        if (cartContainer) cartContainer.classList.add("hidden");
    } else {
        emptyCart.style.display = "none";
        if (cartContainer) cartContainer.classList.remove("hidden");

        // Render items (basic version)
        cart.forEach(item => {
            if (cartItemsContainer) {
                const productDiv = document.createElement('div');
                productDiv.className = 'cart-item';
                productDiv.innerHTML = `
                    <h4>${item.name}</h4>
                    <p>Size: ${item.size}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <hr>
                `;
                cartItemsContainer.appendChild(productDiv);
            }
        });
    }

    // Add-to-cart button logic
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.dataset.product;
            const article = button.closest('.product');
            const size = article.querySelector('select[name="size"]').value;
            const quantity = parseInt(article.querySelector('input[name="quantity"]').value);

            const item = {
                name: productName,
                size: size,
                quantity: quantity
            };

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push(item);
            localStorage.setItem('cart', JSON.stringify(cart));

            alert(`${item.quantity} ${item.size} ${item.name}(s) added to cart!`);
        });
    });
});
