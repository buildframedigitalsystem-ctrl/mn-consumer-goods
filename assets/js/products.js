async function initializeProducts() {

    const productForm =
        document.getElementById("productForm");

    if (!productForm) return;

    productForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const payload = {

                action: "addProduct",

                productName:
                    document.getElementById("productName").value,

                category:
                    document.getElementById("category").value,

                brand:
                    document.getElementById("brand").value,

                supplierCost:
                    document.getElementById("supplierCost").value,

                markupPercent:
                    document.getElementById("wholesaleMarkup").value,

                wholesalePrice:
                    document.getElementById("wholesalePrice").value,

                stockStatus:
                    document.getElementById("stockStatus").value

            };

            try {

                const response =
                    await fetch(API.BASE_URL, {

                        method: "POST",

                        body: JSON.stringify(payload)

                    });

                const data =
                    await response.json();

                if (data.success) {

                    alert("Product saved.");

                    productForm.reset();

                    loadProducts();

                } else {

                    alert(
                        data.message ||
                        "Product save failed."
                    );

                }

            } catch (error) {

                console.error(error);

                alert("Server error.");

            }

        }
    );

    loadProducts();

}

async function loadProducts() {

    try {

        const response =
            await fetch(API.BASE_URL, {

                method: "POST",

                body: JSON.stringify({
                    action: "getProducts"
                })

            });

        const data =
            await response.json();

        const rows =
            data.rows || data.data || [];

        const tbody =
            document.getElementById(
                "productsTableBody"
            );

        if (!tbody) return;

        tbody.innerHTML = "";

        rows.forEach(product => {

            tbody.innerHTML += `
                <tr>
                    <td>${product.ProductName || ""}</td>

                    <td>${product.Category || ""}</td>

                    <td>${product.Brand || ""}</td>

                    <td>
                        ₱${Number(
                product.WholesalePrice || 0
            ).toLocaleString()}
                    </td>

                    <td>
                        ${product.StockStatus || ""}
                    </td>
                </tr>
            `;

        });

    } catch (error) {

        console.error(error);

    }

}

document.addEventListener(
    "DOMContentLoaded",
    initializeProducts
);