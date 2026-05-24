/* =================================
   CUSTOMER LOGIN
================================= */

const loginForm = document.getElementById("customerLoginForm");

/* =================================
   APPS SCRIPT WEBAPP URL
================================= */

const API_URL =
    typeof API !== "undefined" && API.BASE_URL
        ? API.BASE_URL
        : "https://script.google.com/macros/s/AKfycbzbUww2SKIl6uqQvPqLtO6L35A0Xw5Ny0N5hjq16JOguAiLUAovKMdUagJ9SgK1fOSJ/exec";

/* =================================
   LOGIN SUBMIT
================================= */

loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const loginData = {
        action: "loginCustomerAccount",

        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(loginData)
        });

        const result = await response.json();

        if (result.success) {
            localStorage.setItem(
                "mnUser",
                JSON.stringify(result.customer)
            );

            localStorage.setItem(
                "mnCustomerSession",
                JSON.stringify(result.customer)
            );

            alert("Login successful!");

            window.location.href = "index.html";

        } else {
            alert(result.message || "Login failed.");
        }

    } catch (error) {
        console.error(error);
        alert("Connection error.");
    }
});