const showPassword = document.querySelector("#show-password");

showPassword.addEventListener("click", function() {
  const passwordInput = document.getElementById("account_password");
  const type = passwordInput.getAttribute("type");
  if (type == "password") {
    passwordInput.setAttribute("type", "text");
    showPassword.InnerHTML = "Hide Password";
  } else {
    passwordInput.setAttribute("type", "password");
    showPassword.innerHTML = "Show Password";
  }
});