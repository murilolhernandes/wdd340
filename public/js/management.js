'use strict'

// Get a list of account types in the account db based on the 
let accountType = document.querySelector("#account_type")
accountType.addEventListener("change", function() {
  let account_type = accountType.value
  console.log(`account_type is: ${account_type}`)
  let accountTypeURL = `/account/getAccount/${account_type}`
  fetch(accountTypeURL)
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
    throw Error("Network response was not OK");
  })
  .then(function (data) {
    console.log(data);
    buildAccountList(data);
  })
  .catch(function (error) {
    console.log(`There was a problem: ${error.message}`)
  })
})

// Build inventory items into HTML table components and inject into DOM
function buildAccountList(data) {
  let accountDisplay = document.getElementById("accountDisplay");
  // Set up the table labels
  let dataTable = '<thead>';
  dataTable += '<tr><th>Account Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>';
  dataTable += '</thead>';
  // Set up the table body
  dataTable += '<tbody>';
  // Iterate over all vehicles in the array and put each in a row
  data.forEach(function (element) {
    console.log(`${element.account_id}, ${element.account_firstname}`);
    dataTable += `<tr><td>${element.account_firstname} ${element.account_lastname}</td>`;
    dataTable += `<td><a href='/account/edit/${element.account_id}' title='Click to update'>Modify</a></td>`;
    dataTable += `<td><a href='/account/delete/${element.account_id}' title='Click to delete'>Delete</a></td></tr>`;
  })
  dataTable += '</tbody>';
  // Display the contents in the Inventory Management view
  accountDisplay.innerHTML = dataTable;
}