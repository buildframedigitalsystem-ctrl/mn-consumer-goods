/* =========================================
   SUPPLIERS MODULE
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeSuppliers();
});

/* =========================================
   INITIALIZE
========================================= */

async function initializeSuppliers() {

    const supplierForm =
        document.getElementById("supplierForm");

    if (!supplierForm) return;

    supplierForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const payload = {

            action: "addSupplier",

            supplierName:
                document.getElementById("supplierName").value,

            contactPerson:
                document.getElementById("contactPerson").value,

            contactNumber:
                document.getElementById("phone").value,

            email:
                document.getElementById("email").value,

            address:
                document.getElementById("address").value,

            supplierStatus: "ACTIVE"

        };

        try {

            const response = await fetch(API.BASE_URL, {

                method: "POST",

                body: JSON.stringify(payload)

            });

            const data =
                await response.json();

            if (data.success) {

                alert("Supplier saved.");

                supplierForm.reset();

                loadSuppliers();

            } else {

                alert(
                    data.message ||
                    "Supplier save failed."
                );

            }

        } catch (error) {

            console.error(error);

            alert("Server error.");

        }

    });

    loadSuppliers();

}

/* =========================================
   LOAD SUPPLIERS
========================================= */

async function loadSuppliers() {

    const tbody =
        document.getElementById("suppliersTableBody");

    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="5">
                Loading suppliers...
            </td>
        </tr>
    `;

    try {

        const response = await fetch(API.BASE_URL, {

            method: "POST",

            body: JSON.stringify({
                action: "getSuppliers"
            })

        });

        const data =
            await response.json();

        const rows =
            data.rows ||
            data.data ||
            [];

        if (!rows.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="5">
                        No suppliers found.
                    </td>
                </tr>
            `;

            return;
        }

        tbody.innerHTML = "";

        rows.forEach(supplier => {

            const status =
                supplier.SupplierStatus ||
                supplier.Status ||
                "ACTIVE";

            tbody.innerHTML += `

                <tr>

                    <td>
                        <strong>
                            ${supplier.SupplierName || "-"}
                        </strong>
                    </td>

                    <td>
                        ${supplier.ContactPerson || "-"}
                    </td>

                    <td>
                        ${supplier.ContactNumber || "-"}
                    </td>

                    <td>
                        ${supplier.Email || "-"}
                    </td>

                    <td>
                        <span class="status-pill active">
                            ${status}
                        </span>
                    </td>

                </tr>

            `;

        });

    } catch (error) {

        console.error(error);

        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    Failed to load suppliers.
                </td>
            </tr>
        `;

    }

}