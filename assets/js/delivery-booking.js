document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeDeliveryBookingForm();

    }
);

function initializeDeliveryBookingForm() {

    const form =
        document.getElementById(
            "deliveryBookingForm"
        );

    if (!form) return;

    form.addEventListener(
        "submit",
        submitDeliveryBooking
    );

}

async function submitDeliveryBooking(event) {

    event.preventDefault();

    const payload = {

        action:
            "submitDeliveryBooking",

        customerName:
            document.getElementById("customerName").value,

        mobile:
            document.getElementById("mobile").value,

        deliveryAddress:
            document.getElementById("deliveryAddress").value,

        deliveryArea:
            document.getElementById("deliveryArea").value,

        preferredDate:
            document.getElementById("preferredDate").value,

        preferredTime:
            document.getElementById("preferredTime").value,

        deliveryType:
            document.getElementById("deliveryType").value,

        vehicleType:
            document.getElementById("vehicleType").value,

        deliveryNotes:
            document.getElementById("deliveryNotes").value

    };

    try {

        const response =
            await fetch(
                API.BASE_URL,
                {
                    method: "POST",

                    body:
                        JSON.stringify(payload)
                }
            );

        const result =
            await response.json();

        if (result.success) {

            alert(
                "Delivery booking submitted!"
            );

            document.getElementById(
                "deliveryBookingForm"
            ).reset();

        } else {

            alert(
                result.message ||
                "Submission failed."
            );

        }

    } catch (error) {

        console.error(error);

        alert(
            "Connection error."
        );

    }

}