const invModel = require("../models/inventory-model")
const accModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
  * Constructs the nav HTML unordered list
  ************************ */
Util.getNav = async function(req, res, next) {
  let data = await invModel.getClassifications()
  let list = '<ul class="nav-ul">'
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li class="vehicles">'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
      + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
      + 'details"><img src="' + vehicle.inv_thumbnail
      + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
      + ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$'
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle information view HTML
* ************************************ */
Util.buildVehicleDetailGrid = async function(data){
  let grid
  if(data){
    grid = '<div class="vehicle-detail">'
    grid += `
    <div class="vehicle-image">
    <img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model}">
    </div>
    <div class="vehicle-description">
    <div class="vehicle-name-div">
    <h2 class="vehicle-name">${data.inv_make} ${data.inv_model} Details</h2>
    </div>
    <div class="description">
    <p class="price">Price: $${new Intl.NumberFormat('en-us').format(data.inv_price)}</p>
    <p><strong>Description:</strong> ${data.inv_description}</p>
    <p class="color"><strong>Color:</strong> ${data.inv_color}</p>
    <p><strong>Miles:</strong> ${new Intl.NumberFormat('en-US').format(data.inv_miles)}</p>
    </div>
    </div>
    </div>
    `
  } else {
    grid += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle information view HTML
* ************************************ */
Util.getClassificationsDropDown = async function(classification_id){
  let data = await invModel.getClassifications()
  let options = '<option value="">Select a classification</option>'
  data.rows.forEach((row) => {
    options += `<option value="${row.classification_id}"`
    if (classification_id != null && row.classification_id == classification_id) {
      options += " selected"
    }
    options += `>${this.capitalizeFirstLetter(row.classification_name)}</option>`
  })
  return options
}

Util.capitalizeFirstLetter = function(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
**************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else {
    next()
  }
}

/* ****************************************
* Check Login
**************************************** */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
* Check Login Type
**************************************** */
Util.checkLoginType = (req, res, next) => {
  let account_type = res.locals.accountData.account_type
  if (account_type == "Admin" || account_type == "Employee" || account_type == "SuperAdmin") {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* **************************************
* Build the account information view HTML
* ************************************ */
Util.getAccountDropDown = async function(account_id){
  let data = await accModel.getAccountTypes()
  let options = '<option value="">Select an account type</option>'
  data.rows.forEach((row) => {
    options += `<option value="${row.account_type}"`
    if (account_id != null && row.account_type == account_type) {
      options += " selected"
    }
    options += `>${row.account_type}</option>`
  })
  return options
}

module.exports = Util