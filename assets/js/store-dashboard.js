/* =========================================
   M&N STORE APP DASHBOARD
   Safe starter controller
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeStoreDashboard_();
});

function initializeStoreDashboard_() {
    console.log("M&N Store App Dashboard loaded.");

    const user =
        JSON.parse(localStorage.getItem("mnUser") || "{}");

    const storeName =
        user.StoreName ||
        user.BusinessName ||
        user.Name ||
        "M&N Partner Store";

    const storeCard =
        document.querySelector(".store-account-card strong");

    if (storeCard) {
        storeCard.innerText = storeName;
    }
}