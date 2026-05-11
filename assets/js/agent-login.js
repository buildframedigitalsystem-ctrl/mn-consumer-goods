document
    .getElementById("agentLoginForm")
    ?.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        const messageBox =
            document.getElementById("agentLoginMessage");

        messageBox.innerHTML = "Logging in...";

        try {

            const response = await fetch(
                API.BASE_URL,
                {
                    method: "POST",

                    body: JSON.stringify({
                        action: "login",
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (data.success) {

                /* SAVE SESSION */

                localStorage.setItem(
                    "mnSession",
                    JSON.stringify(data.session)
                );

                /* SAVE USER */

                localStorage.setItem(
                    "mnUser",
                    JSON.stringify(data.user)
                );

                messageBox.innerHTML =
                    "Login successful.";

                /* REDIRECT */

                window.location.href =
                    "dashboard-hub.html";

            } else {

                messageBox.innerHTML =
                    data.message ||
                    "Invalid login.";

            }

        } catch (error) {

            console.error(error);

            messageBox.innerHTML =
                "Server connection error.";

        }

    });