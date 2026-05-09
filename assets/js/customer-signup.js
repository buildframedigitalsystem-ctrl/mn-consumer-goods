/* =================================
   CUSTOMER SIGNUP
================================= */

const signupForm = document.getElementById("customerSignupForm");

signupForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const customerData = {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        mobile: document.getElementById("mobile").value,
        customerType: document.getElementById("customerType").value,
        password: document.getElementById("password").value
    };

    console.log("Customer Signup Data:", customerData);

    alert("Customer account created successfully!");

    signupForm.reset();

});