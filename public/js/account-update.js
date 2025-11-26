const form = document.querySelector("#updateForm")
form.addEventListener("change", function () {
  const updateBtn = document.querySelector('#accountUpdate')
  updateBtn.removeAttribute("disabled")
})
// form.addEventListener("change", function () {
//   const updateBtn = document.querySelector('#passwordUpdate')
//   updateBtn.removeAttribute("disabled")
// })