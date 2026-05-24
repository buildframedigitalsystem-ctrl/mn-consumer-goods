/* =========================================
   M&N CUSTOMERS / STORE PARTNERS MODULE
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeCustomers();
});

async function initializeCustomers() {
    const customerForm = document.getElementById("customerForm");

    if (!customerForm) return;

    customerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const payload = {
            action: "addCustomer",

            customerName: getValue_("customerName"),
            customerType: getValue_("customerType") || "WHOLESALE",
            contactNumber: getValue_("contactNumber"),
            email: getValue_("email"),
            address: getValue_("address"),
            notes: getValue_("notes"),

            customerStatus: "ACTIVE"
        };

        if (!payload.customerName) {
            alert("Please enter store/customer name.");
            return;
        }

        if (!payload.contactNumber) {
            alert("Please enter contact number.");
            return;
        }

        try {
            const response = await fetch(API.BASE_URL, {
                method: "POST",
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                alert("Store partner saved.");
                customerForm.reset();
                loadCustomers();
            } else {
                alert(data.message || "Store partner save failed.");
            }

        } catch (error) {
            console.error(error);
            alert("Server error.");
        }
    });

    loadCustomers();
}

async function loadCustomers() {
    const tbody = document.getElementById("customersTableBody");

    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="6">Loading store partners...</td>
        </tr>
    `;

    try {
        const response = await fetch(API.BASE_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "getCustomers"
            })
        });

        const data = await response.json();

        const rows =
            data.rows ||
            data.customers ||
            [];

        if (!rows.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6">No store partners found.</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = "";

        rows.forEach(customer => {
            const type =
                customer.CustomerType ||
                customer.customerType ||
                "WHOLESALE";

            const status =
                customer.CustomerStatus ||
                customer.Status ||
                "ACTIVE";

            tbody.innerHTML += `
                <tr>
                    <td>
                        <strong>${customer.CustomerID || "-"}</strong>
                    </td>

                    <td>
                        <strong>${customer.CustomerName || "-"}</strong>
                        <br>
                        <small>${customer.Address || ""}</small>
                    </td>

                    <td>
                        <span class="status-pill">${type}</span>
                    </td>

                    <td>
                        ${customer.ContactNumber || "-"}
                    </td>

                    <td>
                        ${customer.Email || "-"}
                    </td>

                    <td>
                        <span class="status-pill active">${status}</span>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error(error);

        tbody.innerHTML = `
            <tr>
                <td colspan="6">Failed to load store partners.</td>
            </tr>
        `;
    }
}

function getValue_(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : "";
}