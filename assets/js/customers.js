async function initializeCustomers() {

    const customerForm =
        document.getElementById("customerForm");

    if (!customerForm) return;

    customerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const payload = {

            action: "addCustomer",

            customerName:
                document.getElementById("customerName").value,

            customerType:
                document.getElementById("customerType").value,

            contactNumber:
                document.getElementById("contactNumber").value,

            email:
                document.getElementById("email").value,

            address:
                document.getElementById("address").value,

            notes:
                document.getElementById("notes").value

        };

        try {

            const response = await fetch(API.BASE_URL, {

                method: "POST",
                body: JSON.stringify(payload)

            });

            const data = await response.json();

            if (data.success) {

                alert("Customer saved.");

                customerForm.reset();

                loadCustomers();

            } else {

                alert(
                    data.message ||
                    "Customer save failed."
                );

            }

        } catch (error) {

            console.error(error);

            alert("Server error.");

        }

    });

    loadCustomers();

}

async function loadCustomers() {

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

        const tbody =
            document.getElementById("customersTableBody");

        if (!tbody) return;

        tbody.innerHTML = "";

        rows.forEach(customer => {

            tbody.innerHTML += `

                <tr>

                    <td>
                        ${customer.CustomerID || ""}
                    </td>

                    <td>
                        ${customer.CustomerName || ""}
                    </td>

                    <td>
                        ${customer.CustomerType || ""}
                    </td>

                    <td>
                        ${customer.ContactNumber || ""}
                    </td>

                    <td>
                        ${customer.Email || ""}
                    </td>

                    <td>
                        ${customer.CustomerStatus || customer.Status || ""}
                    </td>

                </tr>

            `;

        });

    } catch (error) {

        console.error(error);

    }

}