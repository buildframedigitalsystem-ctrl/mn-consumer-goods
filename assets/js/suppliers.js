async function initializeSuppliers() {
    const supplierForm = document.getElementById("supplierForm");
    if (!supplierForm) return;

    supplierForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const payload = {
            action: "addSupplier",
            supplierName: document.getElementById("supplierName").value,
            contactPerson: document.getElementById("contactPerson").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            address: document.getElementById("address").value
        };

        try {
            const response = await fetch(API.BASE_URL, {
                method: "POST",
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                alert("Supplier saved.");
                supplierForm.reset();
                loadSuppliers();
            } else {
                alert(data.message || "Supplier save failed.");
            }

        } catch (error) {
            console.error(error);
            alert("Server error.");
        }
    });

    loadSuppliers();
}

async function loadSuppliers() {
    try {
        const response = await fetch(API.BASE_URL, {
            method: "POST",
            body: JSON.stringify({ action: "getSuppliers" })
        });

        const data = await response.json();
        const rows = data.rows || data.data || [];

        const tbody = document.getElementById("suppliersTableBody");
        if (!tbody) return;

        tbody.innerHTML = "";

        rows.forEach(supplier => {
            tbody.innerHTML += `
                <tr>
                    <td>${supplier.SupplierName || ""}</td>
                    <td>${supplier.ContactPerson || ""}</td>
                    <td>${supplier.ContactNumber || ""}</td>
                    <td>${supplier.Email || ""}</td>
                    <td>${supplier.SupplierStatus || ""}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error(error);
    }
}