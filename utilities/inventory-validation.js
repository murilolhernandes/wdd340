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
        const classificationExists = await invModel.checkExistingClassByName(classification_name)
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

validate.inventoryRules = () => {
  return [
    // classification is required and must be in the DB
    body("classification_id")
      .notEmpty().withMessage("Please select a classification.")
      .bail()
      .custom(async (classification_id) => {
        const classificationExists = await invModel.checkExistingClassById(classification_id)
        if (!classificationExists){
          throw new Error("Classification selected is not in the list of classifications. Please choose an existing one")
        }
      }),
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Please provide the name of the make of the vehicle")
      .bail()
      .isLength({ min: 3 }),
    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Please provide the name of the model of the vehicle")
      .bail()
      .isLength({ min: 3 }),
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Please provide a description of the vehicle"),
    body("inv_price")
      .trim()
      .notEmpty()
      .withMessage("Please provide the price of the vehicle")
      .bail()
      .isFloat(),
    body("inv_year")
      .trim()
      .notEmpty()
      .withMessage("Please provide the year of the vehicle")
      .bail()
      .isInt({ min: 1000, max: 9999 })
      .withMessage("Only 4-digits allowed"),
    body("inv_miles")
      .trim()
      .notEmpty()
      .withMessage("Please provide the mileage of the vehicle.")
      .bail()
      .isInt()
      .withMessage("No commas allowed. Please enter the mileage without a comma."),
    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Please provide a color of the vehicle.")
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let dropDownClassification = await utilities.getClassificationsDropDown(classification_id)
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add to Inventory",
      nav,
      dropDownClassification,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    })
    return
  }
  next()
}

validate.checkUpdateData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    const itemData = await invModel.getVehicleByInvId(inv_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    let nav = await utilities.getNav()
    let dropDownClassification = await utilities.getClassificationsDropDown(classification_id)
    res.render("./inventory/modify-inventory", {
      errors,
      title: `Edit ${itemName}`,
      nav,
      dropDownClassification,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      inv_id,
    })
    return
  }
  next()
}

// validate.newInventoryRules = () => {
//   return [
//     // classification is required and must be in the DB
//     body("classification_id")
//       .notEmpty().withMessage("Please select a classification.")
//       .bail()
//       .custom(async (classification_id) => {
//         const classificationExists = await invModel.checkExistingClassById(classification_id)
//         if (!classificationExists){
//           throw new Error("Classification selected is not in the list of classifications. Please choose an existing one")
//         }
//       }),
//     body("inv_make")
//       .trim()
//       .notEmpty()
//       .withMessage("Please provide the name of the make of the vehicle")
//       .bail()
//       .isLength({ min: 3 }),
//     body("inv_model")
//       .trim()
//       .notEmpty()
//       .withMessage("Please provide the name of the model of the vehicle")
//       .bail()
//       .isLength({ min: 3 }),
//     body("inv_description")
//       .trim()
//       .notEmpty()
//       .withMessage("Please provide a description of the vehicle"),
//     body("inv_price")
//       .trim()
//       .notEmpty()
//       .withMessage("Please provide the price of the vehicle")
//       .bail()
//       .isFloat(),
//     body("inv_year")
//       .trim()
//       .notEmpty()
//       .withMessage("Please provide the year of the vehicle")
//       .bail()
//       .isInt({ min: 1000, max: 9999 })
//       .withMessage("Only 4-digits allowed"),
//     body("inv_miles")
//       .trim()
//       .notEmpty()
//       .withMessage("Please provide the mileage of the vehicle.")
//       .bail()
//       .isInt()
//       .withMessage("No commas allowed. Please enter the mileage without a comma."),
//     body("inv_color")
//       .trim()
//       .notEmpty()
//       .withMessage("Please provide a color of the vehicle.")
//   ]
// }

module.exports = validate