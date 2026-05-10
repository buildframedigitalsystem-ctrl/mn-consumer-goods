/* ===============================
   M&N PUBLIC ONLINE STORE
================================ */

let allProducts = [];
let visibleCount = 20;

/* ===============================
   INITIALIZE STORE
================================ */

document.addEventListener("DOMContentLoaded", async () => {

    initializeCategoryCards();

    await loadProductsFromAPI();

    bindStoreEvents();

});

/* ===============================
   LOAD PRODUCTS FROM APPS SCRIPT
================================ */

async function loadProductsFromAPI() {

    try {

        const response = await fetch(API.BASE_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "getProducts"
            })
        });

        const data = await response.json();

        console.log(data);

        const rows = data.rows || data.products || [];

        allProducts = rows;

        renderProducts(allProducts);

    } catch (error) {

        console.error(error);

        document.getElementById("productGrid").innerHTML = `
            <p>Failed to load products.</p>
        `;
    }

}

/* ===============================
   STORE EVENTS
================================ */

function bindStoreEvents() {

    const searchInput =
        document.getElementById("storeSearch");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const loadMoreBtn =
        document.getElementById("loadMoreProducts");

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

/* ===============================
   FILTER PRODUCTS
================================ */

function filterProducts() {

    const searchValue =
        document.getElementById("storeSearch")
            ?.value.toLowerCase() || "";

    const categoryValue =
        document.getElementById("categoryFilter")
            ?.value || "all";

    const filtered = allProducts.filter(product => {

        const productName =
            String(product.ProductName || "").toLowerCase();

        const description =
            String(product.Description || "").toLowerCase();

        const category =
            String(product.Category || "");

        const matchesSearch =
            productName.includes(searchValue) ||
            description.includes(searchValue);

        const matchesCategory =
            categoryValue === "all" ||
            category === categoryValue;

        return matchesSearch && matchesCategory;

    });

    renderProducts(filtered);

}

/* ===============================
   RENDER PRODUCTS
================================ */

function renderProducts(products) {

    const productGrid =
        document.getElementById("productGrid");

    if (!productGrid) return;

    if (products.length === 0) {

        productGrid.innerHTML = `
            <p>No products found.</p>
        `;

        return;

    }

    const visibleProducts =
        products.slice(0, visibleCount);

    productGrid.innerHTML =
        visibleProducts.map(product => `

        <div class="product-card">

            <div class="product-image">

                ${product.ProductImage
                ? `<img src="${product.ProductImage}" alt="${product.ProductName}">`
                : `<span>No Image Yet</span>`
            }

            </div>

            <div class="product-info">

                <span class="product-category">
                    ${product.Category || ""}
                </span>

                <h3>
                    ${product.ProductName || ""}
                </h3>

                <p>
                    ${product.Description || ""}
                </p>

                <div class="product-price">

                    <strong>
                        ₱${Number(product.RetailPrice || 0).toFixed(2)}
                    </strong>

                    <small>
                        Wholesale:
                        ₱${Number(product.WholesalePrice || 0).toFixed(2)}
                    </small>

                </div>

                <button class="order-btn">
                    Order / Inquire
                </button>

            </div>

        </div>

    `).join("");

}

/* =================================
CATEGORY CARD FILTERING
================================= */

function initializeCategoryCards() {

    const cards =
        document.querySelectorAll(".category-card");

    cards.forEach(card => {

        card.addEventListener("click", function () {

            const category =
                this.dataset.category;

            const categoryFilter =
                document.getElementById("categoryFilter");

            if (categoryFilter) {

                categoryFilter.value = category;

                filterProducts();

            }

            const productsSection =
                document.getElementById("products");

            if (productsSection) {

                productsSection.scrollIntoView({
                    behavior: "smooth"
                });

            }

        });

    });

}