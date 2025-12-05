const form = document.querySelector("#updateForm")
form.addEventListener("input", function () {
  const updateBtn = document.querySelector('input[type="submit"]')
  updateBtn.removeAttribute("disabled")
})