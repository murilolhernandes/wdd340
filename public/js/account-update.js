const infoForm = document.querySelector("#updateInfoForm")
infoForm.addEventListener("input", function () {
  const updateBtn = document.querySelector('#accountUpdate')
  updateBtn.removeAttribute("disabled")
})

const passForm = document.querySelector("#updatePasswordForm")
passForm.addEventListener("input", function () {
  const updateBtn = document.querySelector('#passwordUpdate')
  updateBtn.removeAttribute("disabled")
})