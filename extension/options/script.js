const form = document.querySelector('form');
form.addEventListener("submit", (e) => {
    browser.storage.local.set({
        email: document.getElementById("email").value,
        pw: document.getElementById("password").value,
        boxname: document.getElementById("boxname").value,
    })
});

const populateInput = async () => {
    const stored = await browser.storage.local.get(["email", "pw", "boxname"]);
    
    document.getElementById("email").value = stored.email ?? "name@ug.bilkent.edu.tr";
    document.getElementById("password").value = stored.pw ?? "";
    document.getElementById("boxname").value = stored.boxname ?? "STARS Auth";
}

populateInput();
