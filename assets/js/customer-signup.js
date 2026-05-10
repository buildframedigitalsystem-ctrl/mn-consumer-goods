/* =================================
   CUSTOMER SIGNUP
================================= */

const signupForm = document.getElementById("customerSignupForm");

/* =================================
   APPS SCRIPT WEBAPP URL
================================= */

const API_URL = "https://script.google.com/macros/s/AKfycbzbUww2SKIl6uqQvPqLtO6L35A0Xw5Ny0N5hjq16JOguAiLUAovKMdUagJ9SgK1fOSJ/exec";

/* =================================
   SUBMIT
================================= */

signupForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const customerData = {
        action: "createCustomerAccount",

        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        mobile: document.getElementById("mobile").value,
        customerType: document.getElementById("customerType").value,
        password: document.getElementById("password").value
    };

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(customerData)
        });

        const result = await response.json();

        if (result.success) {

            alert("Customer account created successfully!");

            signupForm.reset();

            window.location.href = "customer-login.html";

        } else {

            alert(result.message || "Signup failed.");

        }

    } catch (error) {

        console.error(error);

        alert("Connection error.");

    }

});