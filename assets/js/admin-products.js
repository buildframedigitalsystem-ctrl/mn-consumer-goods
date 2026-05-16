/* =========================================
   ADMIN PRODUCTS
   Official Product Control System
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeAutoPricing_();

    initializeAdminProducts();
});

function initializeAdminProducts() {

    bindAdminProductForm();

    bindProductImageUpload();

    initializeAutoPricing_();

    loadAdminProducts_();
}

/* =========================================
   AUTO PRICE ENGINE
========================================= */

function initializeAutoPricing_() {

    const supplierCostInput =
        document.getElementById("supplierCost");

    const wholesaleMarkupInput =
        document.getElementById("wholesaleMarkup");

    const wholesalePriceInput =
        document.getElementById("wholesalePrice");

    const retailMarkupInput =
        document.getElementById("retailMarkup");

    const retailPriceInput =
        document.getElementById("retailPrice");

    if (
        !supplierCostInput ||
        !wholesaleMarkupInput ||
        !wholesalePriceInput
    ) {
        return;
    }

    function computePrices_() {

        const supplierCost =
            parseFloat(supplierCostInput.value) || 0;

        const wholesaleMarkup =
            parseFloat(wholesaleMarkupInput.value) || 0;

        const retailMarkup =
            parseFloat(retailMarkupInput?.value) || 0;

        /* =========================
           WHOLESALE
        ========================= */

        const wholesalePrice =
            supplierCost +
            (supplierCost * wholesaleMarkup / 100);

        wholesalePriceInput.value =
            wholesalePrice.toFixed(2);

        /* =========================
           RETAIL
        ========================= */

        const retailPrice =
            wholesalePrice +
            (wholesalePrice * retailMarkup / 100);

        if (retailPriceInput) {
            retailPriceInput.value =
                retailPrice.toFixed(2);
        }

        supplierCostInput.addEventListener(
            "input",
            computePrices_
        );

        wholesaleMarkupInput.addEventListener(
            "input",
            computePrices_
        );

        retailMarkupInput.addEventListener(
            "input",
            computePrices_
        );

    }

    /* =========================================
       PRODUCT FORM
    ========================================= */

    function bindAdminProductForm() {
        const form = document.getElementById("adminProductForm");

        if (!form) return;

        form.addEventListener("submit", async function (e) {
            e.preventDefault();
            await saveAdminProduct();
        });
    }

    /* =========================================
       PRODUCT IMAGE UPLOAD
    ========================================= */

    function bindProductImageUpload() {
        const uploadBtn = document.getElementById("uploadProductImageBtn");

        if (!uploadBtn) return;

        uploadBtn.addEventListener("click", async function () {
            await uploadProductImage_();
        });
    }

    async function uploadProductImage_() {
        const fileInput = document.getElementById("productImageFile");
        const imageInput = document.getElementById("productImage");
        const uploadBtn = document.getElementById("uploadProductImageBtn");

        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert("Please choose a product image first.");
            return;
        }

        const file = fileInput.files[0];

        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file only.");
            return;
        }

        try {
            uploadBtn.disabled = true;
            uploadBtn.innerText = "Uploading...";

            const base64 = await fileToBase64_(file);

            const response = await fetch(API.BASE_URL, {
                method: "POST",
                body: JSON.stringify({
                    action: "uploadProductImage",
                    fileName: file.name,
                    mimeType: file.type,
                    imageData: base64
                })
            });

            const result = await response.json();

            if (result.success && result.imageUrl) {
                imageInput.value = result.imageUrl;
                alert("Product image uploaded successfully.");
            } else {
                alert(result.message || "Image upload failed.");
            }

        } catch (error) {
            console.error(error);
            alert("Connection error while uploading image.");
        } finally {
            uploadBtn.disabled = false;
            uploadBtn.innerText = "Upload Product Image";
        }
    }

    function fileToBase64_(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = function () {
                const result = String(reader.result || "");
                const base64 = result.split(",")[1] || "";
                resolve(base64);
            };

            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /* =========================================
       SAVE PRODUCT
    ========================================= */

    async function saveAdminProduct() {
        const payload = {
            action: "adminAddProduct",

            productName: getValue("productName"),
            category: getValue("category"),
            brand: getValue("brand"),
            defaultSupplierName: getValue("defaultSupplierName"),

            supplierCost: getValue("supplierCost"),
            markupPercent: getValue("markupPercent"),
            retailPrice: getValue("retailPrice"),
            wholesalePrice: getValue("wholesalePrice"),

            productImage: getValue("productImage"),
            stockStatus: getValue("stockStatus") || "In Stock",

            promoPrice: getValue("promoPrice"),
            discountLabel: getValue("discountLabel"),
            bundleName: getValue("bundleName"),
            sortOrder: getValue("sortOrder"),

            description: getValue("description"),

            showOnHomepage: isChecked("showOnHomepage") ? "Yes" : "No",
            showInRetail: isChecked("showInRetail") ? "Yes" : "No",
            showInWholesale: isChecked("showInWholesale") ? "Yes" : "No",
            isPromo: isChecked("isPromo") ? "Yes" : "No",
            featured: isChecked("featured") ? "Yes" : "No"
        };

        if (!payload.productName || !payload.category || !payload.retailPrice) {
            alert("Please complete Product Name, Category, and Retail Price.");
            return;
        }

        try {
            const response = await fetch(API.BASE_URL, {
                method: "POST",
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success) {

                alert("✅ Product saved successfully!");

                console.log("Saved Product:", result);

                document.getElementById("adminProductForm").reset();

                resetDefaultCheckboxes_();

                await loadAdminProducts_();

                closeProductFormBlock();

            } else {

                console.error("Save Failed:", result);

                alert(result.message || "Failed to save product.");
            }

        } catch (error) {
            console.error(error);
            alert("Connection error while saving product.");
        }
    }

    /* =========================================
       LOAD PRODUCT TABLE
    ========================================= */

    async function loadAdminProducts_() {
        const tbody = document.querySelector(".metal-table tbody");

        if (!tbody) return;

        tbody.innerHTML = `
        <tr>
            <td colspan="6">Loading products...</td>
        </tr>
    `;

        try {
            const response = await fetch(API.BASE_URL, {
                method: "POST",
                body: JSON.stringify({
                    action: "getProducts"
                })
            });

            const result = await response.json();

            const products =
                result.products ||
                result.rows ||
                result.data ||
                [];

            loadCategoryFilter_(products);

            if (!products.length) {
                tbody.innerHTML = `
                <tr>
                    <td colspan="6">No products found yet.</td>
                </tr>
            `;
                return;
            }

            tbody.innerHTML = products.map(product => {
                const name =
                    product.ProductName ||
                    product.productName ||
                    product.Name ||
                    "-";

                const category =
                    product.Category ||
                    product.category ||
                    "-";

                const retailPrice =
                    product.RetailPrice ||
                    product.retailPrice ||
                    "0";

                const wholesalePrice =
                    product.WholesalePrice ||
                    product.wholesalePrice ||
                    "0";

                const promoPrice =
                    product.PromoPrice ||
                    product.promoPrice ||
                    "-";

                const display =
                    product.ShowOnHomepage ||
                    product.showOnHomepage ||
                    product.Featured ||
                    "-";

                return `
                <tr>
                    <td>${escapeHTML_(name)}</td>
                    <td>${escapeHTML_(category)}</td>
                    <td>₱${formatMoney_(retailPrice)}</td>
                    <td>₱${formatMoney_(wholesalePrice)}</td>
                    <td>${promoPrice && promoPrice !== "-" ? "₱" + formatMoney_(promoPrice) : "-"}</td>
                    <td>${escapeHTML_(display)}</td>
                </tr>
            `;
            }).join("");

        } catch (error) {
            console.error(error);

            tbody.innerHTML = `
            <tr>
                <td colspan="6">Failed to load products.</td>
            </tr>
        `;
        }
    }

    /* =========================================
       FORM BLOCK OPEN / CLOSE
    ========================================= */

    function openProductFormBlock() {
        const overlay = document.getElementById("productFormOverlay");

        if (overlay) {
            overlay.classList.add("active");
        } else {
            alert("Product form block not found.");
        }
    }

    function closeProductFormBlock() {
        const overlay = document.getElementById("productFormOverlay");

        if (overlay) {
            overlay.classList.remove("active");
        }
    }

    /* =========================================
       LOAD CATEGORY FILTER
    ========================================= */

    function loadCategoryFilter_(products) {
        const categorySelect = document.querySelector(".metal-toolbar select");

        if (!categorySelect) return;

        const categories = [];

        products.forEach(product => {
            const category = product.Category || product.category || "";

            if (category && !categories.includes(category)) {
                categories.push(category);
            }
        });

        categories.sort();

        categorySelect.innerHTML = `
        <option value="">All Categories</option>
    `;

        categories.forEach(category => {
            categorySelect.innerHTML += `
            <option value="${escapeHTML_(category)}">
                ${escapeHTML_(category)}
            </option>
        `;
        });
    }

    /* =========================================
       HELPERS
    ========================================= */

    function getValue(id) {
        return document.getElementById(id)?.value.trim() || "";
    }

    function isChecked(id) {
        return document.getElementById(id)?.checked || false;
    }

    function resetDefaultCheckboxes_() {
        const defaults = [
            "showOnHomepage",
            "showInRetail",
            "showInWholesale",
            "featured"
        ];

        defaults.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.checked = true;
        });

        const isPromo = document.getElementById("isPromo");
        if (isPromo) isPromo.checked = false;
    }

    function formatMoney_(value) {
        return Number(value || 0).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function escapeHTML_(value) {
        return String(value || "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }