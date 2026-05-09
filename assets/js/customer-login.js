/* =================================
   CUSTOMER LOGIN
================================= */

const loginForm = document.getElementById("customerLoginForm");

loginForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const loginData = {
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value
    };

    console.log("Customer Login Data:", loginData);

    alert("Login successful!");

    window.location.href = "customer-dashboard.html";

});