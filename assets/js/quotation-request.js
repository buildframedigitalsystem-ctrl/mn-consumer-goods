document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeQuotationRequestForm();

    }
);

/* =========================================
   INITIALIZE FORM
========================================= */

function initializeQuotationRequestForm() {

    const form =
        document.getElementById(
            "quotationRequestForm"
        );

    if (!form) return;

    form.addEventListener(
        "submit",
        submitQuotationRequest
    );

}

/* =========================================
   SUBMIT QUOTATION REQUEST
========================================= */

async function submitQuotationRequest(event) {

    event.preventDefault();

    const submitButton =
        event.target.querySelector("button");

    try {

        submitButton.disabled = true;
        submitButton.innerText =
            "Submitting Request...";

        const payload = {

            action: "submitQuotationRequest",

            customerName:
                document.getElementById("customerName").value,

            businessName:
                document.getElementById("businessName").value,

            mobile:
                document.getElementById("mobile").value,

            email:
                document.getElementById("email").value,

            requestedProducts:
                document.getElementById("requestedProducts").value,

            estimatedQuantity:
                document.getElementById("estimatedQuantity").value,

            preferredBrands:
                document.getElementById("preferredBrands").value,

            deliveryArea:
                document.getElementById("deliveryArea").value,

            budgetRange:
                document.getElementById("budgetRange").value,

            quotationNotes:
                document.getElementById("quotationNotes").value

        };

        const response =
            await fetch(
                API.BASE_URL,
                {
                    method: "POST",

                    body: JSON.stringify(payload)
                }
            );

        const result =
            await response.json();

        if (result.success) {

            alert(
                "Quotation request submitted successfully!"
            );

            document.getElementById(
                "quotationRequestForm"
            ).reset();

        } else {

            alert(
                result.message ||
                "Failed to submit quotation request."
            );

        }

    } catch (error) {

        console.error(error);

        alert(
            "Something went wrong while submitting your request."
        );

    } finally {

        submitButton.disabled = false;

        submitButton.innerText =
            "Submit Quotation Request";

    }

}