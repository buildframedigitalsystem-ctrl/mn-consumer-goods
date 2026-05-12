document.addEventListener("DOMContentLoaded", () => {
    bindAdminProductForm();
});

function bindAdminProductForm() {
    const form = document.getElementById("adminProductForm");

    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        await saveAdminProduct();
    });
}

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
            alert("Product saved successfully!");
            document.getElementById("adminProductForm").reset();

            document.getElementById("showOnHomepage").checked = true;
            document.getElementById("showInRetail").checked = true;
            document.getElementById("showInWholesale").checked = true;
            document.getElementById("featured").checked = true;
        } else {
            alert(result.message || "Failed to save product.");
        }

    } catch (error) {
        console.error(error);
        alert("Connection error while saving product.");
    }
}

function getValue(id) {
    return document.getElementById(id)?.value.trim() || "";
}

function isChecked(id) {
    return document.getElementById(id)?.checked || false;
}

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

function openProductFormBlock() {
    const overlay = document.getElementById("productFormOverlay");

    if (overlay) {
        overlay.classList.add("active");
    }
}

function closeProductFormBlock() {
    const overlay = document.getElementById("productFormOverlay");

    if (overlay) {
        overlay.classList.remove("active");
    }
}