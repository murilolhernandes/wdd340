const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}
const accountModel = require("../models/account-model")

/*  **********************************
  *  Login Data Validation Rules
* ********************************* */
validate.loginRules = () => {
  return [
    // valid email already registered to the DB
    body("account_email")
      .trim()
      .notEmpty().withMessage("Please type your email address.")
      .bail()
      .isEmail({ if: body("account_email").notEmpty() })
      .withMessage("Please provide a valid email address.")
      .bail()
      .normalizeEmail({ gmail_remove_dots: false })
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (!emailExists) {
          throw new Error("Email does not exist in our system. Please provide a valid email address, or register using this email.")
        }
      }),

    // password is required and must be the same strong password
    body("account_password")
      .trim()
      .notEmpty().withMessage("Password is required.")
      .bail()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      }),
  ]
}

/*  **********************************
  * Check data and return errors or continue to login
* ********************************* */
validate.checkLoginData = async (req, res, next) => {
  const { account_email, account_password } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Log in",
      nav,
      account_email,
      account_password,
    })
    return
  }
  next()
}

/*  **********************************
  *  Registration Data Validation Rules
* ********************************* */
validate.registrationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("Please provide a first name."),

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Please provide a last name."),

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .isEmail({ if: body("account_email").notEmpty() })
      .withMessage("Please provide a valid email address.")
      .normalizeEmail({ gmail_remove_dots: false })
      // .normalizeEmail()
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email.")
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty().withMessage("Password is required.")
      .bail() // Prevents a second message from showing (aka "invalid value")
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      }).withMessage("Password does not meet requirements."),
  ]
}

/*  **********************************
  * Check data and return errors or continue to registration
* ********************************* */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

module.exports = validate