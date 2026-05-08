async function initializeReports() {

    loadReports();

}

async function loadReports() {

    try {

        const response = await fetch(API.BASE_URL, {

            method: "POST",

            body: JSON.stringify({
                action: "getReportsDashboard"
            })

        });

        const data = await response.json();

        document.getElementById("reportTotalSales").innerText =
            data.totalSales || 0;

        document.getElementById("reportTotalOrders").innerText =
            data.totalOrders || 0;

        document.getElementById("reportTotalCustomers").innerText =
            data.totalCustomers || 0;

        document.getElementById("reportTotalProducts").innerText =
            data.totalProducts || 0;

        const tbody =
            document.getElementById("reportsTableBody");

        if (!tbody) return;

        tbody.innerHTML = "";

        const transactions =
            data.transactions || [];

        transactions.forEach(item => {

            tbody.innerHTML += `

                <tr>

                    <td>
                        ${item.InvoiceID || ""}
                    </td>

                    <td>
                        ${item.CustomerName || ""}
                    </td>

                    <td>
                        ${item.TotalAmount || ""}
                    </td>

                    <td>
                        ${item.OrderStatus || ""}
                    </td>

                    <td>
                        ${item.CreatedAt || ""}
                    </td>

                </tr>

            `;

        });

    } catch (error) {

        console.error(error);

    }

}