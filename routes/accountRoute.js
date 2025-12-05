// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route to build the account view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build account information through the register page
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to post the registration
router.post('/register',
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount));

// Route to post the login
router.post('/login',
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin));

// Route to account management view
router.get("/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagementView));

// Route to edit account info
router.get("/update", utilities.handleErrors(accountController.buildEditAccInfoView));

// Route to post new account info
router.post("/update-info",
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount));

// Route to post new password
router.post("/update-password",
  regValidate.updatePassword(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccountPassword));

// Route to log the user out
router.get("/logout", utilities.handleErrors(accountController.logout));

// Route to build the account for AJAX route
router.get("/getAccount/:account_type",
  utilities.handleErrors(accountController.getAccountJSON));

// Route to build sever error page
router.get("/trigger-error", utilities.handleErrors(accountController.triggerError));

module.exports = router;