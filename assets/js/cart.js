/* =========================================
   M&N CART SYSTEM
   BuildFrame Store OS
========================================= */

const CART_KEY = "mn_store_cart";

document.addEventListener("DOMContentLoaded", () => {
    renderCart();
    bindCheckoutForm();
});

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function renderCart() {
    const container = document.getElementById("cartItemsContainer");
    const itemCount = document.getElementById("cartItemCount");
    const subtotalBox = document.getElementById("cartSubtotal");
    const totalBox = document.getElementById("cartTotal");

    if (!container) return;

    const cart = getCart();

    if (!cart.length) {
        container.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty.</h3>
                <p>Add products from the retail or wholesale store.</p>

                <div class="empty-cart-actions">
                    <a href="retail.html">Browse Retail</a>
                    <a href="wholesale.html">Browse Wholesale</a>
                    <a href="promos.html">View Promos</a>
                </div>
            </div>
        `;

        if (itemCount) itemCount.textContent = "0";
        if (subtotalBox) subtotalBox.textContent = "₱0.00";
        if (totalBox) totalBox.textContent = "₱0.00";
        return;
    }

    let totalItems = 0;
    let subtotal = 0;

    container.innerHTML = cart.map((item, index) => {
        const quantity = Number(item.quantity || 1);
        const price = Number(item.price || 0);
        const lineTotal = quantity * price;

        totalItems += quantity;
        subtotal += lineTotal;

        return `
            <div class="cart-item">

                <div class="cart-item-image">
                    ${item.image
                ? `<img src="${item.image}" alt="${escapeHTML(item.name)}">`
                : `<span>No Image</span>`
            }
                </div>

                <div class="cart-item-info">
                    <span>${escapeHTML(item.mode || "Product")}</span>
                    <h3>${escapeHTML(item.name || "Unnamed Product")}</h3>
                    <p>${escapeHTML(item.category || "")}</p>
                    <strong>₱${formatMoney(price)}</strong>
                </div>

                <div class="cart-qty-control">
                    <button type="button" onclick="changeQuantity(${index}, -1)">−</button>
                    <input
                        type="number"
                        value="${quantity}"
                        min="1"
                        onchange="setQuantity(${index}, this.value)"
                    >
                    <button type="button" onclick="changeQuantity(${index}, 1)">+</button>
                </div>

                <div class="cart-line-total">
                    ₱${formatMoney(lineTotal)}
                </div>

                <button type="button" class="remove-cart-btn" onclick="removeCartItem(${index})">
                    Remove
                </button>

            </div>
        `;
    }).join("");

    if (itemCount) itemCount.textContent = totalItems;
    if (subtotalBox) subtotalBox.textContent = `₱${formatMoney(subtotal)}`;
    if (totalBox) totalBox.textContent = `₱${formatMoney(subtotal)}`;
}

function changeQuantity(index, amount) {
    const cart = getCart();

    if (!cart[index]) return;

    cart[index].quantity =
        Math.max(1, Number(cart[index].quantity || 1) + amount);

    saveCart(cart);
    renderCart();
}

function setQuantity(index, value) {
    const cart = getCart();

    if (!cart[index]) return;

    cart[index].quantity =
        Math.max(1, Number(value || 1));

    saveCart(cart);
    renderCart();
}

function removeCartItem(index) {
    const cart = getCart();

    cart.splice(index, 1);

    saveCart(cart);
    renderCart();
}

function clearCart() {
    localStorage.removeItem(CART_KEY);
    renderCart();
}

function bindCheckoutForm() {
    const form = document.getElementById("checkoutForm");

    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        await submitCartOrder();
    });
}

async function submitCartOrder() {
    const cart = getCart();

    if (!cart.length) {
        alert("Your cart is empty.");
        return;
    }

    const customerName = document.getElementById("customerName")?.value.trim();
    const customerMobile = document.getElementById("customerMobile")?.value.trim();
    const customerAddress = document.getElementById("customerAddress")?.value.trim();
    const customerNotes = document.getElementById("customerNotes")?.value.trim();

    if (!customerName || !customerMobile || !customerAddress) {
        alert("Please complete customer name, mobile, and address.");
        return;
    }

    const subtotal = cart.reduce((sum, item) => {
        return sum + Number(item.price || 0) * Number(item.quantity || 1);
    }, 0);

    const orderData = {
        action: "createCartOrder",
        customerName,
        customerMobile,
        customerAddress,
        customerNotes,
        totalAmount: subtotal,
        orderSource: "Online Store",
        orderStatus: "Pending",
        paymentStatus: "Unpaid",
        deliveryStatus: "Pending",
        items: cart
    };

    try {
        const response = await fetch(API.BASE_URL, {
            method: "POST",
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (result.success) {
            alert("Order submitted successfully!");

            sendWhatsAppCopy(cart, {
                customerName,
                customerMobile,
                customerAddress,
                customerNotes,
                subtotal
            });

            clearCart();

            window.location.href = "index.html";
        } else {
            alert(result.message || "Order failed. Please try again.");
        }

    } catch (error) {
        console.error(error);
        alert("Connection error. Please try again.");
    }
}

function sendWhatsAppCopy(cart, customer) {
    let message = `Hello M&N Consumer Goods! New order inquiry:%0A%0A`;

    message += `Customer: ${customer.customerName}%0A`;
    message += `Mobile: ${customer.customerMobile}%0A`;
    message += `Address: ${customer.customerAddress}%0A%0A`;

    cart.forEach((item, index) => {
        const qty = Number(item.quantity || 1);
        const price = Number(item.price || 0);
        const subtotal = qty * price;

        message += `${index + 1}. ${item.name}%0A`;
        message += `Type: ${item.mode}%0A`;
        message += `Qty: ${qty}%0A`;
        message += `Price: ₱${formatMoney(price)}%0A`;
        message += `Subtotal: ₱${formatMoney(subtotal)}%0A%0A`;
    });

    message += `Total: ₱${formatMoney(customer.subtotal)}%0A`;

    if (customer.customerNotes) {
        message += `%0ANotes: ${customer.customerNotes}`;
    }

    window.open(
        `https://wa.me/639052273431?text=${message}`,
        "_blank"
    );
}

function formatMoney(value) {
    return Number(value || 0).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function escapeHTML(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}