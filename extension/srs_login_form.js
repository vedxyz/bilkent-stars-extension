const pwInput = document.getElementById("LoginForm_password");
const pwFakeInput = document.querySelector("input[id^='LoginForm-p']");

pwFakeInput.style.display = "none";
pwFakeInput.parentNode.insertBefore(pwInput, pwFakeInput);
pwInput.setAttribute("type", "password");
