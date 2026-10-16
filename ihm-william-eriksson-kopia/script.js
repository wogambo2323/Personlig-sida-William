// Hantering av 'visa mer' sektion
const knapp = document.querySelector("#visa-mer");
const mer = document.querySelector("#mer");

if (mer) {
    mer.classList.add("gomd");
}

function visaMer() {
    if (!mer || !knapp) return;
    mer.classList.toggle("gomd");
    if (mer.classList.contains("gomd")) {
        knapp.textContent = "Visa mer";
        knapp.setAttribute("aria-expanded", "false");
    } else {
        knapp.textContent = "Visa mindre";
        knapp.setAttribute("aria-expanded", "true");
    }
}

if (knapp) {
    knapp.addEventListener("click", visaMer);
}

// Bonus: kopiera mailadressen med ett klick
const kopiera = document.querySelector("#kopiera");

function kopieraMail() {
    navigator.clipboard.writeText("william23eriksson@gmail.com");
    if (kopiera) {
        kopiera.textContent = "Kopierat!";
    }
}

if (kopiera) {
    kopiera.addEventListener("click", kopieraMail);
}

// ==========================================================================
// HubSpot Form Integration
// Formulär-ID: f8528da0-8043-4291-a5ac-57a194856637
// Portal-ID: 149565897 (EU1)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const kontaktForm = document.querySelector("#kontakt-form") || document.querySelector(".kontakt-meddelande");

    if (!kontaktForm) return;

    kontaktForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitBtn = kontaktForm.querySelector(".kontakt-skicka");
        const statusBox = kontaktForm.querySelector("#kontakt-status");
        const btnText = submitBtn ? submitBtn.querySelector(".knapp-text") : null;
        const btnIcon = submitBtn ? submitBtn.querySelector(".knapp-pil") : null;
        const originalText = btnText ? btnText.textContent : "Skicka meddelande";
        const originalIcon = btnIcon ? btnIcon.textContent : "↗";

        const nameInput = kontaktForm.querySelector("#kontakt-namn");
        const emailInput = kontaktForm.querySelector("#kontakt-email");
        const messageInput = kontaktForm.querySelector("#kontakt-text");

        const fullName = (nameInput?.value || "").trim();
        const email = (emailInput?.value || "").trim();
        const message = (messageInput?.value || "").trim();

        if (!email || !fullName || !message) {
            if (statusBox) {
                statusBox.textContent = "Vänligen fyll i alla obligatoriska fält.";
                statusBox.className = "kontakt-status error synlig";
            }
            return;
        }

        // Dela upp namnet i förnamn och eventuellt efternamn för HubSpot CRM
        const nameParts = fullName.split(/\s+/);
        const firstname = nameParts[0] || fullName;
        const lastname = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

        // Hämta HubSpot tracking-cookie (hutk) om besökaren har den
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(";").shift();
            return null;
        }

        const hutk = getCookie("hubspotutk");

        const fields = [
            { name: "firstname", value: firstname },
            { name: "email", value: email },
            { name: "message", value: message }
        ];

        if (lastname) {
            fields.push({ name: "lastname", value: lastname });
        }

        const portalId = "149565897";
        const formGuid = "f8528da0-8043-4291-a5ac-57a194856637";
        const endpoint = `https://api-eu1.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;

        const payload = {
            submittedAt: Date.now(),
            fields: fields,
            context: {
                ...(hutk ? { hutk } : {}),
                pageUri: window.location.href,
                pageName: document.title
            }
        };

        // Visa laddar-tillstånd på knappen
        if (submitBtn) {
            submitBtn.disabled = true;
            if (btnText) btnText.textContent = "Skickar...";
            if (btnIcon) btnIcon.textContent = "⏳";
        }

        if (statusBox) {
            statusBox.textContent = "";
            statusBox.className = "kontakt-status";
        }

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("HubSpot submission error:", errorData);
                throw new Error("Kunde inte skicka formuläret.");
            }

            kontaktForm.reset();

            if (statusBox) {
                statusBox.textContent = "Tack för ditt meddelande! Jag återkommer så snart som möjligt.";
                statusBox.className = "kontakt-status success synlig";
            }

            if (submitBtn) {
                if (btnText) btnText.textContent = "Skickat!";
                if (btnIcon) btnIcon.textContent = "✓";
                setTimeout(() => {
                    submitBtn.disabled = false;
                    if (btnText) btnText.textContent = originalText;
                    if (btnIcon) btnIcon.textContent = originalIcon;
                }, 4000);
            }
        } catch (error) {
            console.error("Fel vid inskickning till HubSpot:", error);
            if (statusBox) {
                statusBox.textContent = "Något gick fel när meddelandet skulle skickas. Vänligen försök igen eller kontakta mig direkt via e-post eller LinkedIn.";
                statusBox.className = "kontakt-status error synlig";
            }
            if (submitBtn) {
                submitBtn.disabled = false;
                if (btnText) btnText.textContent = originalText;
                if (btnIcon) btnIcon.textContent = originalIcon;
            }
        }
    });
});