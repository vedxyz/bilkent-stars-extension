const parser = new DOMParser();

const form = document.getElementById("verifyEmail-form");
const input = document.getElementById("EmailVerifyForm_verifyCode");
const currentRef = document.querySelector("#EmailVerifyForm_verifyCode_em_ + p.help-block strong").textContent;

const getCode = async (credentials, iv, boxname = "STARS Auth") => {
    return await (await fetch(`https://bilkent-stars-ext.azurewebsites.net/api/obtaincode?credentials=${credentials}&iv=${iv}&boxname=${boxname}`)).json();
};

const fillAndSubmit = async () => {
    const stored = await browser.storage.local.get(["credentials", "iv", "boxname"]);
    
    if (!stored.credentials) {
        console.warn("Credentials have not been provided to the extension. 2FA autofill will not function.")
        return;
    }
    
    let counter = 0;
    
    let interval = setInterval(async () => {
        try {
            const {code, ref} = await getCode(stored.credentials, stored.iv, stored.boxname);
            console.log(code, ref);
        
            if (ref === currentRef) {
                input.value = code;
                form.submit();
                clearInterval(interval);
            } else if (counter < 8) {
                counter++;
            } else {
                clearInterval(interval);
            }
        } catch (error) {
            console.error(error);
            clearInterval(interval);
            return;
        }
    }, 2500);
};

fillAndSubmit();
