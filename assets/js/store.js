/* ===============================
   M&N PUBLIC ONLINE STORE
   BuildFrame Store Rendering Engine
================================ */

let allProducts = [];
let visibleCount = 20;

/* ===============================
   PAGE MODE DETECTION
================================ */

function getStoreMode() {
    const page = window.location.pathname.toLowerCase();

    if (page.includes("wholesale")) return "wholesale";
    if (page.includes("retail")) return "retail";
    if (page.includes("promos")) return "promo";

    return "home";
}

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
    const productGrid = document.getElementById("productGrid");

    try {
        if (productGrid) {
            productGrid.innerHTML = `<p>Loading products...</p>`;
        }

        const response = await fetch(API.BASE_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "getProducts"
            })
        });

        const data = await response.json();

        const rows = data.rows || data.products || data.data || [];

        allProducts = rows;

        populateCategoryFilter(allProducts);

        filterProducts();

    } catch (error) {
        console.error(error);

        if (productGrid) {
            productGrid.innerHTML = `<p>Failed to load products.</p>`;
        }
    }
}

/* ===============================
   STORE EVENTS
================================ */

function bindStoreEvents() {
    const searchInput = document.getElementById("storeSearch");
    const categoryFilter = document.getElementById("categoryFilter");
    const loadMoreBtn = document.getElementById("loadMoreProducts");

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            visibleCount = 20;
            filterProducts();
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener("change", () => {
            visibleCount = 20;
            filterProducts();
        });
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
    const mode = getStoreMode();

    const searchValue =
        document.getElementById("storeSearch")
            ?.value.toLowerCase() || "";

    const categoryValue =
        document.getElementById("categoryFilter")
            ?.value || "all";

    let filtered = allProducts.filter(product => {
        const productName =
            String(product.ProductName || product.Name || "").toLowerCase();

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

        const matchesMode = productMatchesMode(product, mode);

        return matchesSearch && matchesCategory && matchesMode;
    });

    renderProducts(filtered, mode);
}

/* ===============================
   MODE RULES
================================ */

function productMatchesMode(product, mode) {
    if (mode === "home") {
        return isYes(product.ShowOnHomepage) || isYes(product.Featured) || true;
    }

    if (mode === "retail") {
        return isYes(product.ShowInRetail) || Number(product.RetailPrice || 0) > 0;
    }

    if (mode === "wholesale") {
        return isYes(product.ShowInWholesale) || Number(product.WholesalePrice || 0) > 0;
    }

    if (mode === "promo") {
        return isYes(product.IsPromo) ||
            isYes(product.OnSale) ||
            Number(product.PromoPrice || 0) > 0 ||
            String(product.DiscountLabel || "").trim() !== "";
    }

    return true;
}

/* ===============================
   RENDER PRODUCTS
================================ */

function renderProducts(products, mode) {
    const productGrid = document.getElementById("productGrid");
    const loadMoreBtn = document.getElementById("loadMoreProducts");

    if (!productGrid) return;

    if (!products || products.length === 0) {
        productGrid.innerHTML = `<p>No products found.</p>`;

        if (loadMoreBtn) {
            loadMoreBtn.style.display = "none";
        }

        return;
    }

    const visibleProducts = products.slice(0, visibleCount);

    productGrid.innerHTML = visibleProducts.map(product => {
        return createProductCard(product, mode);
    }).join("");

    if (loadMoreBtn) {
        loadMoreBtn.style.display =
            products.length > visibleCount ? "inline-block" : "none";
    }
}

/* ===============================
   PRODUCT CARD
================================ */

function createProductCard(product, mode) {
    const name = product.ProductName || product.Name || "Unnamed Product";
    const category = product.Category || "";
    const description = product.Description || "";
    const image = getProductImage(product);

    const retailPrice = Number(product.RetailPrice || 0);
    const wholesalePrice = Number(product.WholesalePrice || 0);
    const promoPrice = Number(product.PromoPrice || 0);

    const priceHTML = getPriceHTML({
        mode,
        retailPrice,
        wholesalePrice,
        promoPrice,
        discountLabel: product.DiscountLabel || "",
        bundleName: product.BundleName || ""
    });

    return `
        <div
    class="product-card"
    onclick="openProductModal(${allProducts.indexOf(product)})"
>

            <div class="product-image">
                ${image
            ? `<img src="${image}" alt="${escapeHTML(name)}" loading="lazy">`
            : `<span>No Image Yet</span>`
        }
            </div>

            <div class="product-info">

                <span class="product-category">
                    ${escapeHTML(category)}
                </span>

                <h3>${escapeHTML(name)}</h3>

                <p>${escapeHTML(description)}</p>

                ${priceHTML}

                <div class="product-actions">

             <button
                 class="view-btn"
                 onclick="openProductModal(${index})"
                 >
                   View Details
              </button>

                 <button
                    class="cart-btn"
                       onclick="addToCart(${index})"
                       >
                 🛒 Add To Cart
             </button>

            </div>

            </div>

        </div>
    `;
}

/* ===============================
   PRICE DISPLAY
================================ */

function getPriceHTML(data) {
    if (data.mode === "wholesale") {
        return `
            <div class="product-price">
                <strong>Wholesale: ₱${formatMoney(data.wholesalePrice)}</strong>
                <small>Retail: ₱${formatMoney(data.retailPrice)}</small>
            </div>
        `;
    }

    if (data.mode === "promo") {
        return `
            <div class="product-price">
                ${data.discountLabel
                ? `<span class="promo-label">${escapeHTML(data.discountLabel)}</span>`
                : ""
            }

                ${data.bundleName
                ? `<small>${escapeHTML(data.bundleName)}</small>`
                : ""
            }

                <strong>Promo: ₱${formatMoney(data.promoPrice || data.retailPrice)}</strong>
                <small>Regular: ₱${formatMoney(data.retailPrice)}</small>
            </div>
        `;
    }

    return `
        <div class="product-price">
            <strong>Retail: ₱${formatMoney(data.retailPrice)}</strong>
            <small>Wholesale: ₱${formatMoney(data.wholesalePrice)}</small>
        </div>
    `;
}

/* ===============================
   CATEGORY FILTER OPTIONS
================================ */

function populateCategoryFilter(products) {
    const categoryFilter = document.getElementById("categoryFilter");

    if (!categoryFilter) return;

    const categories = [...new Set(
        products
            .map(product => product.Category)
            .filter(Boolean)
    )];

    categoryFilter.innerHTML = `
        <option value="all">All Categories</option>
        ${categories.map(category => `
            <option value="${escapeHTML(category)}">
                ${escapeHTML(category)}
            </option>
        `).join("")}
    `;
}

/* =================================
   CATEGORY CARD FILTERING
================================= */

function initializeCategoryCards() {
    const cards = document.querySelectorAll(".category-card");

    cards.forEach(card => {
        card.addEventListener("click", function () {
            const category = this.dataset.category;

            const categoryFilter =
                document.getElementById("categoryFilter");

            if (categoryFilter) {
                categoryFilter.value = category;
                visibleCount = 20;
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

/* ===============================
   IMAGE HANDLING
================================ */

function getProductImage(product) {
    const image =
        product.ProductImage ||
        product.ImageURL ||
        product.Image ||
        "";

    if (!image) return "";

    if (image.startsWith("http")) {
        return image;
    }

    return `assets/images/products/${image}`;
}

/* ===============================
   INQUIRY ACTION
================================ */

function inquireProduct(productName) {
    alert(`Inquiry for: ${productName}`);
}

/* ===============================
   HELPERS
================================ */

function isYes(value) {
    return String(value || "")
        .toLowerCase()
        .trim() === "yes" ||
        String(value || "")
            .toLowerCase()
            .trim() === "true" ||
        String(value || "")
            .toLowerCase()
            .trim() === "active" ||
        String(value || "")
            .trim() === "1";
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

/* =========================================
   PRODUCT MODAL SYSTEM
========================================= */

function openProductModal(productIndex) {

    const product = allProducts[productIndex];

    if (!product) return;

    const modal =
        document.getElementById("productModal");

    if (!modal) return;

    const image =
        getProductImage(product);

    const retailPrice =
        Number(product.RetailPrice || 0);

    const wholesalePrice =
        Number(product.WholesalePrice || 0);

    const promoPrice =
        Number(product.PromoPrice || 0);

    document.getElementById(
        "modalProductImage"
    ).src =
        image || "assets/images/no-image.png";

    document.getElementById(
        "modalProductName"
    ).innerText =
        product.ProductName || "Unnamed Product";

    document.getElementById(
        "modalProductCategory"
    ).innerText =
        product.Category || "General";

    document.getElementById(
        "modalProductDescription"
    ).innerText =
        product.Description ||
        "No description available.";

    /* =========================
       PRICE BOX
    ========================= */

    document.getElementById(
        "modalPriceBox"
    ).innerHTML = `
        <strong>
            Retail: ₱${formatMoney(retailPrice)}
        </strong>

        <small>
            Wholesale: ₱${formatMoney(wholesalePrice)}
        </small>

        ${promoPrice > 0
            ? `
                <small>
                    Promo: ₱${formatMoney(promoPrice)}
                </small>
            `
            : ""
        }
    `;

    /* =========================
       BADGES
    ========================= */

    const badges = [];

    if (isYes(product.IsPromo)) {
        badges.push("PROMO");
    }

    if (isYes(product.Featured)) {
        badges.push("FEATURED");
    }

    if (isYes(product.ShowInWholesale)) {
        badges.push("WHOLESALE");
    }

    if (isYes(product.ShowInRetail)) {
        badges.push("RETAIL");
    }

    if (
        String(product.DiscountLabel || "")
            .trim() !== ""
    ) {
        badges.push(product.DiscountLabel);
    }

    document.getElementById(
        "modalBadges"
    ).innerHTML =
        badges.map(badge => `
            <span class="modal-badge">
                ${escapeHTML(badge)}
            </span>
        `).join("");

    /* =========================
       WHATSAPP BUTTON
    ========================= */

    const message =
        encodeURIComponent(
            `Hello M&N Consumer Goods! I would like to inquire about:\n\n${product.ProductName}`
        );

    document.getElementById(
        "modalWhatsAppBtn"
    ).href =
        `https://wa.me/639052273431?text=${message}`;

    /* =========================
       ADD TO CART BUTTON
    ========================= */

    const addToCartBtn =
        document.getElementById(
            "modalAddToCartBtn"
        );

    if (addToCartBtn) {

        addToCartBtn.onclick = function () {
            addToCart(productIndex);
        };

    }

    modal.classList.add("active");

}

/* =========================
   WHATSAPP BUTTON
========================= */

const message =
    encodeURIComponent(
        `Hello M&N Consumer Goods! I would like to inquire about:\n\n${product.ProductName}`
    );

document.getElementById(
    "modalWhatsAppBtn"
).href =
    `https://wa.me/639052273431?text=${message}`;

modal.classList.add("active");

/* =========================================
   CLOSE MODAL
========================================= */

function closeProductModal() {

    const modal =
        document.getElementById("productModal");

    if (modal) {
        modal.classList.remove("active");
    }

}

/* =========================================
   CLOSE WHEN CLICK OUTSIDE
========================================= */

window.addEventListener("click", function (event) {

    const modal =
        document.getElementById("productModal");

    if (
        event.target === modal
    ) {
        closeProductModal();
    }

});

/* ===============================
   HEADER SEARCH
================================ */

document.addEventListener("DOMContentLoaded", () => {
    const headerSearchInput = document.getElementById("headerSearchInput");
    const headerSearchBtn = document.getElementById("headerSearchBtn");

    if (headerSearchBtn && headerSearchInput) {
        headerSearchBtn.addEventListener("click", () => {
            applyHeaderSearch();
        });

        headerSearchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                applyHeaderSearch();
            }
        });
    }
});

function applyHeaderSearch() {
    const headerSearchInput = document.getElementById("headerSearchInput");
    const storeSearch = document.getElementById("storeSearch");

    if (!headerSearchInput || !storeSearch) return;

    storeSearch.value = headerSearchInput.value.trim();

    const productsSection = document.getElementById("products");

    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: "smooth"
        });
    }

    visibleCount = 20;
    filterProducts();
}