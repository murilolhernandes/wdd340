// const accountModel = require("../models/account-model")
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

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
    res.status(500).render("account/register", {
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

/* ***************************
 *  Process login request
* ************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash(
      "notice",
      "Please check your credentials and try again."
    )
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) 
    {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') 
      {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    } 
    else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ***************************
 *  Deliver account management view
* ************************** */
async function buildManagementView(req, res, next) {
  let nav = await utilities.getNav()
  const account_firstname = res.locals.accountData.account_firstname
  const accountSelect = await utilities.getAccountDropDown()
  res.render("account/management", {
    title: "Account Management",
    nav,
    account_firstname,
    accountSelect,
    errors: null,
  })
}

/* ***************************
 *  Deliver edit account information view
* ************************** */
async function buildEditAccInfoView(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id
  const accountData = await accountModel.getAccountById(account_id)
  res.render("account/edit-account", {
    title: "Edit Account",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: accountData.account_id,
  })
}

/* ***************************
 *  Update Account Data
* ************************** */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  )

  if (updateResult) {
    const accountData = await accountModel.getAccountById(account_id)
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })

    req.flash(
      "notice", "Congratulations, your information has been updated."
    )
    res.status(201).redirect("/account")
  } else {
    req.flash("notice", "Sorry the update failed.")
    res.status(501).render("/account/edit-account", {
    title: "Edit Account",
    nav,
    errors: null,
    account_firstname,
    account_lastname,
    account_email,
    account_id,
    })
  }
}

/* ***************************
 *  Update Password
* ************************** */
async function updateAccountPassword(req, res, next) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body

  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password change.')
    return res.status(500).render("account/edit-account", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id,
    })
  }

  const updateResult = await accountModel.updateAccountPassword(
    hashedPassword,
    account_id,
  )

  if (updateResult) {
    const accountData = await accountModel.getAccountById(account_id)
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })

    req.flash(
      "notice", "Congratulations, your password has been updated."
    )
    res.status(201).redirect("/account")
  } else {
    req.flash("notice", "Sorry the update failed.")
    return res.status(501).render("account/edit-account", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id,
    })
  }
}

/* ***************************
 *  Log the user out
* ************************** */
async function logout(req, res, next) {
  res.clearCookie("jwt")
  res.redirect("/")
}

/* ***************************
 *  Return account by account_type as JSON
* ************************** */
async function getAccountJSON(req, res, next){
  const account_type = req.params.account_type
  const accData = await accountModel.getAccountByType(account_type)
  if (accData[0].account_id) {
    return res.json(accData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build the edit view
* ************************** */
async function buildModifyAccountView(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)
  const accountData = await accountModel.getAccountById(account_id)
  const userName = `${accountData.account_firstname} ${accountData.account_lastname}`
  const accountSelect = await utilities.getAccountDropDown(accountData.account_type)
  res.render("account/modify-user-account", {
    title: `Edit ${userName}'s Account`,
    nav,
    errors: null,
    accountSelect: accountSelect,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: accountData.account_id,
  })
}

/* ***************************
 *  Update User Account Data
* ************************** */
async function updateUserAccount(req, res, next) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_type, account_id } = req.body

  const updateResult = await accountModel.updateUserAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_type,
    account_id,
  )

  if (updateResult) {
    const userName = `${updateResult.account_firstname} ${updateResult.account_lastname}`
    req.flash(
      "notice", `Congratulations, ${userName}'s information has been updated.`
    )
    res.status(201).redirect("/account")
  } else {
    const userName = `${account_firstname} ${account_lastname}`
    const accountSelect = await utilities.getAccountDropDown(account_type)
    req.flash("notice", "Sorry the update failed.")
    res.status(501).render("account/modify-user-account", {
    title: `Edit ${userName}'s Account`,
    nav,
    errors: null,
    accountSelect,
    account_firstname,
    account_lastname,
    account_email,
    account_id,
    })
  }
}

/* ***************************
 *  Build the delete view
* ************************** */
async function buildDeleteConfirmationView(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(account_id)
  const userName = `${accountData.account_firstname} ${accountData.account_lastname}`
  const accountSelect = await utilities.getAccountDropDown(accountData.account_type)
  res.render("./account/delete-user", {
    title: `Delete ${userName}`,
    nav,
    errors: null,
    accountSelect: accountSelect,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: accountData.account_id,
  })
}

/* ***************************
 *  Delete Inventory Data
* ************************** */
async function deleteUser(req, res, next) {
  // let nav = await utilities.getNav()
  const account_id = parseInt(req.body.account_id)

  const deleteResult = await accountModel.deleteUserData(account_id)
  
  if (deleteResult) {
    req.flash(
      "notice", `The deletion was successfull.`
    )
    res.status(201).redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect(`/account/delete/${account_id}`)
  }
}

module.exports = { buildLogin, buildRegister, accountLogin, registerAccount, buildManagementView, buildEditAccInfoView, updateAccount, updateAccountPassword, logout, getAccountJSON, buildModifyAccountView, updateUserAccount, buildDeleteConfirmationView, deleteUser }