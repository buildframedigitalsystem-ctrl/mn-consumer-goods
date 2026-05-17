/* =========================================
   PRODUCTS MODULE
   M&N Consumer Goods / BuildFrame Store OS
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeProducts();
});

/* =========================================
   INITIALIZE PRODUCTS
========================================= */

function initializeProducts() {
    const productForm = document.getElementById("productForm");

    if (!productForm) {
        loadProducts();
        return;
    }

    initializeProductAutoPricing_();

    productForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const payload = {
            action: "addProduct",

            productName: getProductValue_("productName"),
            category: getProductValue_("category"),
            brand: getProductValue_("brand"),

            supplierCost: getProductValue_("supplierCost"),
            markupPercent: getProductValue_("wholesaleMarkup"),
            wholesalePrice: getProductValue_("wholesalePrice"),

            stockStatus: getProductValue_("stockStatus")
        };

        if (!payload.productName || !payload.category) {
            alert("Please complete Product Name and Category.");
            return;
        }

        try {
            const response = await fetch(API.BASE_URL, {
                method: "POST",
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                alert("Product saved.");
                productForm.reset();
                loadProducts();
            } else {
                alert(data.message || "Product save failed.");
            }

        } catch (error) {
            console.error(error);
            alert("Server error.");
        }
    });

    loadProducts();
}

/* =========================================
   AUTO WHOLESALE PRICE CALCULATOR
========================================= */

function initializeProductAutoPricing_() {
    const supplierCostInput = document.getElementById("supplierCost");
    const wholesaleMarkupInput = document.getElementById("wholesaleMarkup");
    const wholesalePriceInput = document.getElementById("wholesalePrice");

    if (!supplierCostInput || !wholesaleMarkupInput || !wholesalePriceInput) {
        return;
    }

    function computeWholesalePrice_() {
        const supplierCost = parseFloat(supplierCostInput.value) || 0;
        const wholesaleMarkup = parseFloat(wholesaleMarkupInput.value) || 0;

        const wholesalePrice =
            supplierCost + (supplierCost * wholesaleMarkup / 100);

        wholesalePriceInput.value = wholesalePrice.toFixed(2);
    }

    supplierCostInput.addEventListener("input", computeWholesalePrice_);
    wholesaleMarkupInput.addEventListener("input", computeWholesalePrice_);
}

/* =========================================
   LOAD PRODUCTS
========================================= */

async function loadProducts() {
    try {
        const response = await fetch(API.BASE_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "getProducts"
            })
        });

        const data = await response.json();

        const rows =
            data.products ||
            data.rows ||
            data.data ||
            [];

        const tbody = document.getElementById("productsTableBody");

        if (!tbody) return;

        if (!rows.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5">No products found yet.</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = rows.map((product) => {
            const productName =
                product.ProductName ||
                product.productName ||
                product.Name ||
                "";

            const category =
                product.Category ||
                product.category ||
                "";

            const brand =
                product.Brand ||
                product.brand ||
                "";

            const wholesalePrice =
                product.WholesalePrice ||
                product.wholesalePrice ||
                0;

            const imageUrl =
                product.ProductImage ||
                product.productImage ||
                product.ImageUrl ||
                product.imageUrl ||
                product.IMAGE_URL ||
                product.ImageURL ||
                product.imageURL ||
                "";

            const stockStatus =
                product.StockStatus ||
                product.stockStatus ||
                "";

            return `
                <tr>
                    <td>
                        ${imageUrl
                    ? `<img src="${escapeProductHTML_(imageUrl)}"
                                     alt="${escapeProductHTML_(productName)}"
                                     style="width:55px;height:55px;object-fit:cover;border-radius:10px;margin-right:8px;vertical-align:middle;">`
                    : ""
                }
                        ${escapeProductHTML_(productName)}
                    </td>
                    <td>${escapeProductHTML_(category)}</td>
                    <td>${escapeProductHTML_(brand)}</td>
                    <td>₱${formatProductMoney_(wholesalePrice)}</td>
                    <td>${escapeProductHTML_(stockStatus)}</td>
                </tr>
            `;
        }).join("");

    } catch (error) {
        console.error(error);
    }
}

/* =========================================
   HELPERS
========================================= */

function getProductValue_(id) {
    return document.getElementById(id)?.value.trim() || "";
}

function formatProductMoney_(value) {
    return Number(value || 0).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function escapeProductHTML_(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}