/* =========================================
   M&N RESELLER APPLICATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    bindResellerApplicationForm();

});

/* =========================================
   BIND FORM
========================================= */

function bindResellerApplicationForm() {

    const form =
        document.getElementById(
            "resellerApplicationForm"
        );

    if (!form) return;

    form.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            await submitResellerApplication();

        }
    );

}

/* =========================================
   SUBMIT APPLICATION
========================================= */

async function submitResellerApplication() {

    const fullName =
        document.getElementById("fullName")
            ?.value.trim();

    const businessName =
        document.getElementById("businessName")
            ?.value.trim();

    const mobile =
        document.getElementById("mobile")
            ?.value.trim();

    const email =
        document.getElementById("email")
            ?.value.trim();

    const businessType =
        document.getElementById("businessType")
            ?.value.trim();

    const preferredArea =
        document.getElementById("preferredArea")
            ?.value.trim();

    const monthlyEstimate =
        document.getElementById("monthlyEstimate")
            ?.value.trim();

    const interestedProducts =
        document.getElementById("interestedProducts")
            ?.value.trim();

    const notes =
        document.getElementById("notes")
            ?.value.trim();

    /* =========================
       VALIDATION
    ========================= */

    if (!fullName || !mobile) {

        alert(
            "Please complete Full Name and Mobile Number."
        );

        return;

    }

    /* =========================
       PAYLOAD
    ========================= */

    const payload = {

        action:
            "submitResellerApplication",

        fullName:
            fullName,

        businessName:
            businessName,

        mobile:
            mobile,

        email:
            email,

        businessType:
            businessType,

        preferredArea:
            preferredArea,

        monthlyOrderEstimate:
            monthlyEstimate,

        interestedProducts:
            interestedProducts,

        notes:
            notes

    };

    try {

        const response =
            await fetch(API.BASE_URL, {

                method: "POST",

                body: JSON.stringify(payload)

            });

        const result =
            await response.json();

        if (result.success) {

            alert(
                "Application submitted successfully!"
            );

            sendResellerWhatsApp(payload);

            document.getElementById(
                "resellerApplicationForm"
            ).reset();

        } else {

            alert(
                result.message ||
                "Application failed."
            );

        }

    } catch (error) {

        console.error(error);

        alert(
            "Connection error. Please try again."
        );

    }

}

/* =========================================
   WHATSAPP COPY
========================================= */

function sendResellerWhatsApp(data) {

    let message =
        `Hello M&N Consumer Goods!%0A%0A`;

    message +=
        `I submitted a reseller application.%0A%0A`;

    message +=
        `Full Name: ${data.fullName}%0A`;

    message +=
        `Business Name: ${data.businessName}%0A`;

    message +=
        `Mobile: ${data.mobile}%0A`;

    message +=
        `Email: ${data.email}%0A`;

    message +=
        `Business Type: ${data.businessType}%0A`;

    message +=
        `Preferred Area: ${data.preferredArea}%0A`;

    message +=
        `Estimated Monthly Orders: ${data.monthlyOrderEstimate}%0A`;

    message +=
        `Interested Products: ${data.interestedProducts}%0A`;

    if (data.notes) {

        message +=
            `Notes: ${data.notes}%0A`;

    }

    window.open(
        `https://wa.me/639052273431?text=${message}`,
        "_blank"
    );

}