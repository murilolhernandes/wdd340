// const accountModel = require("../models/account-model")
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

// const accountCont = {}

/* ***************************
 *  Deliver login view
* ************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Deliver registration view
* ************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Deliver login view
* ************************** */
async function login(req, res) {
  let nav = await utilities.getNav();
  const { account_email } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (accountData) {
    req.flash(
      "notice",
      `Congratulations, you're logged in ${accountData.account_firstname}.`
    )
    res.status(200).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    // This part is just for safety, in case the email is not found
    req.flash("notice", "Login failed. Please try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  }
}

/* ***************************
 *  Deliver registration view
* ************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    req.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

module.exports = { buildLogin, buildRegister, login, registerAccount }