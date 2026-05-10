/* =================================
   SUPPLIER LOGIN
================================= */

const supplierLoginForm = document.getElementById("supplierLoginForm");

supplierLoginForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const supplierLoginData = {
        email: document.getElementById("supplierEmail").value,
        password: document.getElementById("supplierPassword").value
    };

    console.log("Supplier Login Data:", supplierLoginData);

    alert("Supplier login successful!");

    window.location.href = "supplier-dashboard.html";

});