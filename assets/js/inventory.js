async function initializeInventory() {

    loadInventory();

}

async function loadInventory() {

    try {

        const response = await fetch(API.BASE_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "getInventory"
            })
        });

        const data = await response.json();

        const rows =
            data.rows || data.inventory || [];

        const tbody =
            document.getElementById("inventoryTableBody");

        if (!tbody) return;

        tbody.innerHTML = "";

        rows.forEach(item => {

            tbody.innerHTML += `
                <tr>
                    <td>${item.ProductID || ""}</td>
                    <td>${item.ProductName || ""}</td>
                    <td>${item.CurrentStock || 0}</td>
                    <td>${item.AvailableStock || 0}</td>
                    <td>${item.InventoryStatus || ""}</td>
                </tr>
            `;

        });

    } catch (error) {

        console.error(error);

    }

}