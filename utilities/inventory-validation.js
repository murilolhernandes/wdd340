const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}
const invModel = require("../models/inventory-model")

validate.classificationRules = () => {
  return [
    // classification name cannot contain spaces or special characters.
    body("classification_name")
      .trim()
      .notEmpty().withMessage("Classification name is required.")
      .bail()
      .isAlpha().withMessage("No spaces or special characters.")
      .custom(async (classification_name) => {
        const classificationExists = await invModel.checkExistingClass(classification_name)
        if (classificationExists){
          throw new Error("Classification exists. Please insert a new classification")
        }
      }),
  ] 
}

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

module.exports = validate