const checkAuthStatus = async () => {
    
    const statusText = document.querySelector("#auth-status-light + p");
    const statusLight = document.getElementById("auth-status-light");
    
    if ((await browser.storage.local.get(["credentials"])).credentials) {
        statusText.textContent = "Credentials are stored";
        statusLight.style.backgroundColor = "green";
    }
    
}

const form = document.querySelector('form');
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = document.querySelector("form button");
    button.disabled = true;
    button.textContent = "Obtaining encrypted credentials...";
    
    const { credentials, iv } = await (await fetch(`https://bilkent-stars-ext.azurewebsites.net/api/encryptcredentials?email=${
        document.getElementById("email").value
    }&password=${
        document.getElementById("password").value
    }`)).json();

    browser.storage.local.set({
        credentials,
        iv,
        boxname: document.getElementById("boxname").value,
    })
    
    checkAuthStatus();
    button.disabled = false;
    button.textContent = "Save";
});

const populateInput = async () => {
    const stored = await browser.storage.local.get(["boxname"]);
    document.getElementById("boxname").value = stored.boxname ?? "STARS Auth";
}

populateInput();
checkAuthStatus();
