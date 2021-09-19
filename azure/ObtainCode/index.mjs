import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import { decryptCredentials } from "./credentialresolver.mjs";

const getLoginTokens = async () => {
    const page = await fetch("https://webmail.bilkent.edu.tr/");
    const domBody = new JSDOM(await page.text()).window.document.body;
    const token = domBody.querySelector("input[name='_token']").getAttribute("value");
    const sessid = page.headers.get("Set-Cookie").split("; ").find(e => e.startsWith("roundcube_sessid"));

    console.log("Form Token: " + token);
    console.log("Sessid: " + sessid);
    return { token, sessid };
};

const login = async (email, pw) => {
    const loginTokens = await getLoginTokens();
    
    const response = await fetch("https://webmail.bilkent.edu.tr/?_task=login", {
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "Upgrade-Insecure-Requests": "1",
            "Cookie": loginTokens.sessid,
        },
        "body": `_token=${loginTokens.token}&_task=login&_action=login&_timezone=Europe%2FIstanbul&_url=&_user=${email}&_pass=${pw}`,
        "method": "POST",
        "redirect": "manual",
    });

    const cookies = response.headers.raw()["set-cookie"].map(e => e.substring(0, e.indexOf(";")));
    console.log(cookies);
    
    cookies.shift();
    return cookies.join("; ");
};

const getLatestUid = async (credentials, boxname) => {
    const response = await fetch(`https://webmail.bilkent.edu.tr/?_task=mail&_action=list&_refresh=1&_mbox=${boxname}&_remote=1&_unlock=&_=`, {
        "headers": {
            "Cookie": credentials,
        }
    });
    
    const uid = (await response.json()).env.messagecount;
    console.log("Uid: " + uid);
    return uid;
};

const getMail = async (credentials, boxname, uid) => {
    const page = await fetch(`https://webmail.bilkent.edu.tr/?_task=mail&_mbox=${boxname}&_uid=${uid}&_action=show`, {
        "headers": {
            "Cookie": credentials,
        }
    });
    
    const match = new JSDOM(await page.text()).window.document.body.querySelector("#messagebody").textContent.match(/: (\d{5}) .* coded ([A-Z]{4})./);
    console.log("Code: " + match[1], "Ref: " + match[2]);
    
    return { code: match[1], ref: match[2] };
};

export default async function (context, req) {
    try {
        context.log('JavaScript HTTP trigger function processed a request.');
        const boxname = req.query.boxname;
        
        const decrypted = await decryptCredentials(req.query.credentials, req.query.iv);
        const credentials = await login(decrypted.email, decrypted.password);
        
        context.res = {
            body: await getMail(credentials, boxname, await getLatestUid(credentials, boxname)),
            contentType: "application/json",
        };
    } catch (error) {
        console.error(error);
        context.res = {
            status: 500,
        };
    }
}
