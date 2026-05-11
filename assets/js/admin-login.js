const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const loginMessage = document.getElementById("loginMessage");

    loginMessage.innerHTML = "Logging in...";

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

            /* SAVE SESSION */

            localStorage.setItem(
                "mnSession",
                JSON.stringify(data.session)
            );

            /* OPTIONAL USER INFO */

            localStorage.setItem(
                "mnUser",
                JSON.stringify(data.user)
            );

            loginMessage.innerHTML = "Login successful.";

            /* REDIRECT */

            window.location.href = "dashboard-hub.html";

        } else {

            loginMessage.innerHTML =
                data.message || "Login failed.";

        }

    } catch (error) {

        console.error(error);

        loginMessage.innerHTML =
            "Server connection error.";

    }

});