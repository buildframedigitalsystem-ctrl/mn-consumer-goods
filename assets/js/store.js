/* ===============================
   M&N PUBLIC ONLINE STORE
================================ */

const PRODUCTS_API_URL = "PASTE_YOUR_WEBAPP_URL_HERE";

let allProducts = [];
let visibleCount = 20;

/* TEMP PRODUCTS UNTIL GOOGLE SHEETS IS CONNECTED */
const sampleProducts = Array.from({ length: 30 }, (_, i) => ({
    name: `Sample Product ${i + 1}`,
    category: i % 2 === 0 ? "Retail" : "Wholesale",
    price: 100 + i * 10,
    wholesalePrice: 80 + i * 8,
    image: "",
    stock: 50 + i,
    description: "Product details will appear here once uploaded by admin."
}));

document.addEventListener("DOMContentLoaded", () => {
    allProducts = sampleProducts;
    renderProducts(allProducts);
    bindStoreEvents();
});

function bindStoreEvents() {
    const searchInput = document.getElementById("storeSearch");
    const categoryFilter = document.getElementById("categoryFilter");
    const loadMoreBtn = document.getElementById("loadMoreProducts");

    if (searchInput) {
        searchInput.addEventListener("input", filterProducts);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener("change", filterProducts);
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () => {
            visibleCount += 20;
            filterProducts();
        });
    }
}

function filterProducts() {
    const searchValue = document.getElementById("storeSearch")?.value.toLowerCase() || "";
    const categoryValue = document.getElementById("categoryFilter")?.value || "all";

    const filtered = allProducts.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchValue) ||
            product.description.toLowerCase().includes(searchValue);

        const matchesCategory =
            categoryValue === "all" || product.category === categoryValue;

        return matchesSearch && matchesCategory;
    });

    renderProducts(filtered);
}

function renderProducts(products) {
    const productGrid = document.getElementById("productGrid");
    if (!productGrid) return;

    const visibleProducts = products.slice(0, visibleCount);

    productGrid.innerHTML = visibleProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.image
            ? `<img src="${product.image}" alt="${product.name}">`
            : `<span>No Image Yet</span>`
        }
            </div>

            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3>${product.name}</h3>
                <p>${product.description}</p>

                <div class="product-price">
                    <strong>₱${Number(product.price).toFixed(2)}</strong>
                    <small>Wholesale: ₱${Number(product.wholesalePrice).toFixed(2)}</small>
                </div>

                <button class="order-btn">Order / Inquire</button>
            </div>
        </div>
    `).join("");

    const loadMoreBtn = document.getElementById("loadMoreProducts");
    if (loadMoreBtn) {
        loadMoreBtn.style.display = products.length > visibleCount ? "inline-block" : "none";
    }
}