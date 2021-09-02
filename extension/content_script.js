const parser = new DOMParser();

const form = document.getElementById("verifyEmail-form");
const input = document.getElementById("EmailVerifyForm_verifyCode");
const currentRef = document.querySelector("#EmailVerifyForm_verifyCode_em_ + p.help-block strong").textContent;

const getCode = async (email, pw, boxname = "STARS Auth") => {
    return await (await fetch(`https://srs-2fa-code-obtain.azurewebsites.net/api/obtaincode?email=${email}&pw=${pw}&boxname=${boxname}`)).json();
};

const fillAndSubmit = async () => {
    const stored = await browser.storage.local.get(["email", "pw", "boxname"]);
    
    let counter = 0;
    
    let interval = setInterval(async () => {
        try {
            const {code, ref} = await getCode(stored.email, stored.pw, stored.boxname);
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
