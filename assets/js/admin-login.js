const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const loginMessage = document.getElementById("loginMessage");

    loginMessage.innerHTML = "Logging in...";

    try {

        const response = await fetch(API.BASE_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "login",
                username,
                password
            })
        });

        const data = await response.json();

        if (data.success) {

            localStorage.setItem(
                "mnAdminSession",
                JSON.stringify(data.user)
            );

            loginMessage.innerHTML = "Login successful.";

            window.location.href = "admin-dashboard.html";

        } else {

            loginMessage.innerHTML = data.message || "Login failed.";

        }

    } catch (error) {

        console.error(error);

        loginMessage.innerHTML = "Server connection error.";

    }

});