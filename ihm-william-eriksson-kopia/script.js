const knapp = document.querySelector("#visa-mer");
const mer = document.querySelector("#mer");
mer.classList.add("gomd");

function visaMer() {
    mer.classList.toggle("gomd");
    if (mer.classList.contains("gomd")) {
        knapp.textContent = "Visa mer";
        knapp.setAttribute("aria-expanded", "false");
    } else {
        knapp.textContent = "Visa mindre";
        knapp.setAttribute("aria-expanded", "true");
    }
}

knapp.addEventListener("click", visaMer);

// Bonus: kopiera mailadressen med ett klick
const kopiera = document.querySelector("#kopiera");

function kopieraMail() {
    navigator.clipboard.writeText("alex.lind@example.com");
    kopiera.textContent = "Kopierat!";
}

kopiera.addEventListener("click", kopieraMail);