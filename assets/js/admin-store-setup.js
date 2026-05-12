document.addEventListener("DOMContentLoaded", () => {
    bindStoreSetupForm();
    loadStoreSetup();
});

function bindStoreSetupForm() {
    const form = document.getElementById("storeSetupForm");

    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        await saveStoreSetup();
    });
}

async function loadStoreSetup() {
    try {
        const response = await fetch(API.BASE_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "getStoreSetup"
            })
        });

        const result = await response.json();

        if (!result.success || !result.store) return;

        const store = result.store;

        setValue("businessName", store.BusinessName);
        setValue("tagline", store.Tagline);
        setValue("mobile", store.Mobile);
        setValue("email", store.Email);
        setValue("facebookUrl", store.FacebookURL);
        setValue("address", store.Address);
        setValue("logoUrl", store.LogoURL);
        setValue("bannerUrl", store.BannerURL);
        setValue("heroTitle", store.HeroTitle);
        setValue("heroSubtitle", store.HeroSubtitle);
        setValue("aboutStore", store.AboutStore);

    } catch (error) {
        console.error(error);
    }
}

async function saveStoreSetup() {
    const payload = {
        action: "saveStoreSetup",
        businessName: getValue("businessName"),
        tagline: getValue("tagline"),
        mobile: getValue("mobile"),
        email: getValue("email"),
        facebookUrl: getValue("facebookUrl"),
        address: getValue("address"),
        logoUrl: getValue("logoUrl"),
        bannerUrl: getValue("bannerUrl"),
        heroTitle: getValue("heroTitle"),
        heroSubtitle: getValue("heroSubtitle"),
        aboutStore: getValue("aboutStore")
    };

    try {
        const response = await fetch(API.BASE_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.success) {
            alert("Store setup saved successfully!");
        } else {
            alert(result.message || "Failed to save store setup.");
        }

    } catch (error) {
        console.error(error);
        alert("Connection error while saving store setup.");
    }
}

function getValue(id) {
    return document.getElementById(id)?.value.trim() || "";
}

function setValue(id, value) {
    const el = document.getElementById(id);

    if (el) {
        el.value = value || "";
    }
}