/* ===============================
   M&N STORE PARTNER PRODUCT ENGINE
   BuildFrame Store Network OS
================================ */

let allProducts = [];
let visibleCount = 20;

const STORE_CART_KEY_PUBLIC = "mn_store_partner_cart";

/* ===============================
   PAGE MODE DETECTION
================================ */

function getStoreMode() {
    const page = window.location.pathname.toLowerCase();

    if (page.includes("wholesale")) return "wholesale";
    if (page.includes("promos")) return "promo";

    return "home";
}

/* ===============================
   URL CATEGORY DETECTION
================================ */

function getCategoryFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("category") || "";
}

/* ===============================
   INITIALIZE STORE
================================ */

document.addEventListener("DOMContentLoaded", async () => {
    initializeCategoryCards();
    bindStoreEvents();

    await loadProductsFromAPI();

    const categoryFromURL = getCategoryFromURL();
    const categoryFilter = document.getElementById("categoryFilter");

    if (categoryFromURL && categoryFilter) {
        const decodedCategory = decodeURIComponent(categoryFromURL);

        const optionExists = [...categoryFilter.options].some(option => {
            return option.value === decodedCategory;
        });

        if (optionExists) {
            categoryFilter.value = decodedCategory;
        }

        visibleCount = 20;
        filterProducts();
    }

    bindHeaderSearch();
});

/* ===============================
   LOAD PRODUCTS
================================ */

async function loadProductsFromAPI() {
    const productGrid = document.getElementById("productGrid");

    try {
        if (productGrid) {
            productGrid.innerHTML = `<p>Loading products...</p>`;
        }

        if (typeof API === "undefined" || !API.BASE_URL) {
            throw new Error("API config is missing.");
        }

        const response = await fetch(API.BASE_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "getWholesaleProducts"
            })
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || "Failed to fetch products.");
        }

        const rows =
            data.rows ||
            data.products ||
            data.data ||
            [];

        allProducts = Array.isArray(rows) ? rows : [];

        populateCategoryFilter(allProducts);
        filterProducts();

    } catch (error) {
        console.error("Product load error:", error);

        if (productGrid) {
            productGrid.innerHTML = `<p>Failed to load products.</p>`;
        }
    }
}

/* ===============================
   EVENTS
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
            ?.value
            .toLowerCase()
            .trim() || "";

    const categoryValue =
        document.getElementById("categoryFilter")
            ?.value || "all";

    const filtered = allProducts.filter(product => {
        const productName =
            String(
                product.ProductName ||
                product.productName ||
                product.Name ||
                ""
            ).toLowerCase();

        const description =
            String(
                product.Description ||
                product.description ||
                ""
            ).toLowerCase();

        const category =
            String(
                product.Category ||
                product.category ||
                ""
            );

        const matchesSearch =
            productName.includes(searchValue) ||
            description.includes(searchValue);

        const normalizedCategory =
            category.toLowerCase().trim();

        const normalizedCategoryValue =
            categoryValue.toLowerCase().trim();

        const matchesCategory =
            normalizedCategoryValue === "all" ||
            normalizedCategory === normalizedCategoryValue ||
            normalizedCategory.includes(normalizedCategoryValue) ||
            normalizedCategoryValue.includes(normalizedCategory);

        const matchesMode =
            productMatchesMode(product, mode);

        return matchesSearch && matchesCategory && matchesMode;
    });

    renderProducts(filtered, mode);
}

/* ===============================
   MODE RULES
================================ */

function productMatchesMode(product, mode) {
    if (mode === "home") {
        return (
            isYes(product.Featured) ||
            isYes(product.ShowInWholesale) ||
            Number(product.WholesalePrice || product.wholesalePrice || 0) > 0
        );
    }

    if (mode === "wholesale") {
        return (
            isYes(product.ShowInWholesale) ||
            Number(product.WholesalePrice || product.wholesalePrice || 0) > 0
        );
    }

    if (mode === "promo") {
        return (
            isYes(product.IsPromo) ||
            isYes(product.OnSale) ||
            Number(product.PromoPrice || product.promoPrice || 0) > 0 ||
            String(product.DiscountLabel || "").trim() !== "" ||
            String(product.BundleName || "").trim() !== ""
        );
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

    productGrid.innerHTML =
        visibleProducts
            .map(product => createProductCard(product, mode))
            .join("");

    if (loadMoreBtn) {
        loadMoreBtn.style.display =
            products.length > visibleCount
                ? "inline-block"
                : "none";
    }
}

/* ===============================
   PRODUCT CARD
================================ */

function createProductCard(product, mode) {
    const productIndex = getProductIndex_(product);

    const name =
        product.ProductName ||
        product.productName ||
        product.Name ||
        "Unnamed Product";

    const category =
        product.Category ||
        product.category ||
        "";

    const description =
        product.Description ||
        product.description ||
        "";

    const image = getProductImage(product);

    const wholesalePrice =
        Number(product.WholesalePrice || product.wholesalePrice || 0);

    const promoPrice =
        Number(product.PromoPrice || product.promoPrice || 0);

    const piecesPerBox =
        Number(product.PiecesPerBox || product.piecesPerBox || 0);

    const boxPrice =
        Number(product.BoxPrice || product.boxPrice || 0) ||
        wholesalePrice * piecesPerBox;

    const stockStatus =
        String(product.StockStatus || product.stockStatus || "")
            .toLowerCase()
            .trim();

    const stockQtyRaw =
        product.StockQty || product.stockQty || "";

    const hasStockQty =
        stockQtyRaw !== "" &&
        stockQtyRaw !== null &&
        stockQtyRaw !== undefined;

    const stockQty =
        hasStockQty ? Number(stockQtyRaw) : null;

    const reorderLevel =
        Number(product.ReorderLevel || product.reorderLevel || 10);

    let isOutOfStock =
        stockStatus === "out of stock";

    let isLowStock =
        stockStatus === "low stock";

    if (hasStockQty) {
        isOutOfStock = stockQty <= 0;
        isLowStock = stockQty > 0 && stockQty <= reorderLevel;
    }

    let stockBadge = `
    <span class="stock-badge in-stock">
        🟢 In Stock
    </span>
`;

    if (isOutOfStock) {
        stockBadge = `
        <span class="stock-badge out-stock">
            🔴 Out Of Stock
        </span>
    `;
    } else if (isLowStock) {
        stockBadge = `
        <span class="stock-badge low-stock">
            🔵 Low Stock
        </span>
    `;
    }

    const priceHTML = getPriceHTML({
        mode,
        wholesalePrice,
        promoPrice,
        piecesPerBox,
        boxPrice,
        discountLabel: product.DiscountLabel || "",
        bundleName: product.BundleName || ""
    });

    return `
        <div class="product-card">

            <div class="product-image">
                ${image
            ? `<img src="${image}" alt="${escapeHTML(name)}" loading="lazy" onerror="this.src='assets/images/no-image.png';">`
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
                ${stockBadge}

                <div class="product-actions">

                    <button
                        type="button"
                        class="view-btn"
                        onclick="openProductModal(${productIndex})"
                    >
                        View Details
                    </button>

                    ${isOutOfStock
            ? `
            <button
                type="button"
                class="cart-btn out-stock-btn"
                disabled
            >
                OUT OF STOCK
            </button>
        `
            : `
            <button
                type="button"
                class="cart-btn"
                onclick="addProductToCartSafe_(${productIndex})"
            >
                🛒 Add To Cart
            </button>
        `
        }

                </div>

            </div>

        </div>
    `;
}

function getProductIndex_(product) {
    return allProducts.findIndex(item => {
        const itemKey =
            item.ProductID ||
            item.productId ||
            item.ProductName ||
            item.Name;

        const productKey =
            product.ProductID ||
            product.productId ||
            product.ProductName ||
            product.Name;

        return String(itemKey) === String(productKey);
    });
}

/* ===============================
   PRICE DISPLAY
================================ */

function getPriceHTML(data) {

    const hasBoxPrice =
        data.piecesPerBox > 0 &&
        data.boxPrice > 0;

    if (data.mode === "promo" && data.promoPrice > 0) {

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

                <strong>
                    Promo: ₱${formatMoney(data.promoPrice)}
                </strong>

                <small>
                    Wholesale per piece:
                    ₱${formatMoney(data.wholesalePrice)}
                </small>

                ${hasBoxPrice
                ? `
                            <small>
                                ${data.piecesPerBox} pcs / box:
                                ₱${formatMoney(data.boxPrice)}
                            </small>
                        `
                : ""
            }

            </div>
        `;
    }

    return `
        <div class="product-price">

            <strong>
                Wholesale per piece:
                ₱${formatMoney(data.wholesalePrice)}
            </strong>

            ${hasBoxPrice
            ? `
                        <small>
                            ${data.piecesPerBox} pcs / box:
                            ₱${formatMoney(data.boxPrice)}
                        </small>
                    `
            : ""
        }

        </div>
    `;
}

/* ===============================
   CATEGORY FILTER
================================ */

function populateCategoryFilter(products) {
    const categoryFilter =
        document.getElementById("categoryFilter");

    if (!categoryFilter) return;

    const categories =
        [...new Set(
            products
                .map(product =>
                    product.Category ||
                    product.category ||
                    ""
                )
                .filter(Boolean)
        )];

    categoryFilter.innerHTML = `
        <option value="all">All Categories</option>

        ${categories
            .map(category => `
                    <option value="${escapeHTML(category)}">
                        ${escapeHTML(category)}
                    </option>
                `)
            .join("")
        }
    `;
}

/* ===============================
   CATEGORY CARDS
================================ */

function initializeCategoryCards() {

    const cards = document.querySelectorAll(
        ".category-card, .category-chip"
    );

    cards.forEach(card => {

        card.addEventListener("click", function (event) {

            event.preventDefault();

            const category =
                this.dataset.category ||
                this.getAttribute("data-category");

            if (!category || category === "all") {
                window.location.href = "wholesale.html";
                return;
            }

            window.location.href =
                `wholesale.html?category=${encodeURIComponent(category)}`;

        });

    });

}

/* ===============================
   IMAGE HANDLING
================================ */

function getProductImage(product) {
    let image =
        product.ProductImage ||
        product.productImage ||
        product.ImageURL ||
        product.Image ||
        "";

    if (!image) return "";

    image = String(image).trim();

    const driveMatch =
        image.match(/\/d\/([^/]+)/) ||
        image.match(/id=([^&]+)/);

    if (driveMatch && driveMatch[1]) {
        return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w1000`;
    }

    if (image.startsWith("http")) {
        return image;
    }

    return `assets/images/products/${image}`;
}

/* ===============================
   PRODUCT MODAL
================================ */

function openProductModal(productIndex) {
    const product = allProducts[productIndex];

    if (!product) return;

    const modal =
        document.getElementById("productModal");

    if (!modal) {
        alert(product.ProductName || product.productName || "Product selected.");
        return;
    }

    const image = getProductImage(product);

    setModalImage_("modalProductImage", image);
    setModalText_("modalProductName", product.ProductName || product.productName || "Unnamed Product");
    setModalText_("modalProductCategory", product.Category || product.category || "General");
    setModalText_("modalProductDescription", product.Description || product.description || "No description available.");

    const modalPriceBox =
        document.getElementById("modalPriceBox");

    if (modalPriceBox) {
        modalPriceBox.innerHTML = `
            <strong>Wholesale: ₱${formatMoney(product.WholesalePrice || product.wholesalePrice || 0)}</strong>

            ${Number(product.PromoPrice || product.promoPrice || 0) > 0
                ? `<small>Promo: ₱${formatMoney(product.PromoPrice || product.promoPrice)}</small>`
                : ""
            }
        `;
    }

    renderModalBadges_(product);

    const addToCartBtn =
        document.getElementById("modalAddToCartBtn");

    if (addToCartBtn) {
        addToCartBtn.onclick = function () {
            addProductToCartSafe_(productIndex);
        };
    }

    modal.classList.add("active");
}

function renderModalBadges_(product) {
    const badgeBox =
        document.getElementById("modalBadges");

    if (!badgeBox) return;

    const badges = [];

    if (isYes(product.IsPromo)) badges.push("PROMO");
    if (isYes(product.Featured)) badges.push("FEATURED");
    if (isYes(product.ShowInWholesale)) badges.push("WHOLESALE");

    if (String(product.DiscountLabel || "").trim() !== "") {
        badges.push(product.DiscountLabel);
    }

    badgeBox.innerHTML =
        badges
            .map(badge => `
                <span class="modal-badge">
                    ${escapeHTML(badge)}
                </span>
            `)
            .join("");
}

function closeProductModal() {
    const modal =
        document.getElementById("productModal");

    if (modal) {
        modal.classList.remove("active");
    }
}

window.addEventListener("click", function (event) {
    const modal =
        document.getElementById("productModal");

    if (event.target === modal) {
        closeProductModal();
    }
});

/* ===============================
   ADD TO CART
================================ */

function addProductToCartSafe_(productIndex) {
    const product = allProducts[productIndex];

    if (!product) return;

    const cart =
        JSON.parse(localStorage.getItem(STORE_CART_KEY_PUBLIC)) || [];

    const productId =
        product.ProductID ||
        product.productId ||
        product.ProductName ||
        product.productName ||
        product.Name;

    const existingIndex =
        cart.findIndex(item =>
            String(item.productId) === String(productId)
        );

    const price =
        Number(
            product.PromoPrice ||
            product.promoPrice ||
            product.WholesalePrice ||
            product.wholesalePrice ||
            0
        );

    const cartItem = {
        productId,
        name:
            product.ProductName ||
            product.productName ||
            product.Name ||
            "Unnamed Product",

        category:
            product.Category ||
            product.category ||
            "",

        image:
            getProductImage(product),

        quantity: 1,

        mode:
            "WHOLESALE",

        price
    };

    if (existingIndex >= 0) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push(cartItem);
    }

    localStorage.setItem(
        STORE_CART_KEY_PUBLIC,
        JSON.stringify(cart)
    );

    showCartSuccess_();
}

/* ===============================
   CART SUCCESS
================================ */

function showCartSuccess_() {
    window.location.href = "cart.html";
}

/* ===============================
   HEADER SEARCH
================================ */

function bindHeaderSearch() {
    const headerSearchInput =
        document.getElementById("headerSearchInput");

    const headerSearchBtn =
        document.getElementById("headerSearchBtn");

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
}

function applyHeaderSearch() {
    const headerSearchInput =
        document.getElementById("headerSearchInput");

    const storeSearch =
        document.getElementById("storeSearch");

    if (!headerSearchInput || !storeSearch) return;

    storeSearch.value =
        headerSearchInput.value.trim();

    const productsSection =
        document.getElementById("products");

    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: "smooth"
        });
    }

    visibleCount = 20;
    filterProducts();
}

/* ===============================
   SMALL HELPERS
================================ */

function setModalText_(id, value) {
    const element =
        document.getElementById(id);

    if (element) {
        element.innerText = value || "-";
    }
}

function setModalImage_(id, image) {
    const element =
        document.getElementById(id);

    if (!element) return;

    element.src =
        image || "assets/images/no-image.png";
}

function isYes(value) {
    const normalized =
        String(value || "")
            .toLowerCase()
            .trim();

    return (
        normalized === "yes" ||
        normalized === "true" ||
        normalized === "active" ||
        normalized === "1"
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