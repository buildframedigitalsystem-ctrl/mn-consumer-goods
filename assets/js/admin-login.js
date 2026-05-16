const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        const loginMessage = document.getElementById("loginMessage");

        if (loginMessage) {
            loginMessage.innerHTML = "Logging in...";
        }

        try {

            const response = await fetch(API.BASE_URL, {

                method: "POST",

                body: JSON.stringify({
                    action: "login",
                    email,
                    password
                })

            });

            const data = await response.json();

            if (data.success) {

                localStorage.setItem(
                    "mnSession",
                    JSON.stringify(data.session || {})
                );

                localStorage.setItem(
                    "mnUser",
                    JSON.stringify(data.user || {})
                );

                if (loginMessage) {
                    loginMessage.innerHTML = "Login successful.";
                }

                const role =
                    String(
                        data.user?.Role ||
                        data.user?.role ||
                        data.session?.Role ||
                        data.session?.role ||
                        ""
                    )
                        .trim()
                        .toUpperCase();

                redirectUserByRole_(role);

            } else {

                if (loginMessage) {
                    loginMessage.innerHTML =
                        data.message || "Login failed.";
                }

            }

        } catch (error) {

            console.error(error);

            if (loginMessage) {
                loginMessage.innerHTML =
                    "Server connection error.";
            }

        }

    });

}

function redirectUserByRole_(role) {

    if (role === "ADMIN" || role === "MASTER ADMIN" || role === "OWNER") {
        window.location.href = "admin-dashboard.html";
        return;
    }

    if (role === "STORE" || role === "STORE OWNER" || role === "CUSTOMER") {
        window.location.href = "store-dashboard.html";
        return;
    }

    if (role === "SUPPLIER") {
        window.location.href = "supplier-dashboard.html";
        return;
    }

    if (role === "AGENT" || role === "RESELLER") {
        window.location.href = "agent-dashboard.html";
        return;
    }

    window.location.href = "store-dashboard.html";
}