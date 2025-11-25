const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
* ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by vehicle view
* ************************** */
invCont.buildByVehicleId = async function (req, res, next) {
  const inv_id = req.params.invId
  // const inv_id = parseInt(req.params.invId)
  const data = await invModel.getVehicleByInvId(inv_id)
  const grid = await utilities.buildVehicleDetailGrid(data)
  let nav = await utilities.getNav()
  const vehicleName = `${data.inv_year} ${data.inv_make} ${data.inv_model}`
  res.render("./inventory/vehicle", {
    title: vehicleName,
    nav,
    grid,
  })
}

/* ***************************
 *  Build management view
* ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.getClassificationsDropDown()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect,
  })
}

/* ***************************
 *  Deliver add classification view
* ************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Get classification name by classification_id
* ************************** */
invCont.buildAddClassificationForm = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const addResult = await invModel.addClassification(
    classification_name
  )

  if (addResult) {
    req.flash(
      "notice",
      `The ${classification_name} was successfully added.`
    )
    res.status(201).redirect("/inv/")
  } else {
    req.flash("notice", "Provide a correct classification name.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
    })
  }
}

/* ***************************
 *  Deliver add inventory view
* ************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let dropDownClassification = await utilities.getClassificationsDropDown()
  res.render("./inventory/add-inventory", {
    title: "Add to Inventory",
    nav,
    dropDownClassification,
    errors: null,
  })
}

/* ***************************
 *  Build add inventory view
* ************************** */
invCont.buildAddInventoryForm = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body

  const addResult = await invModel.addInventory(
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
  )
  
  if (addResult) {
    req.flash(
      "notice", `The ${inv_make} ${inv_model} was successfully added.`
    )
    res.status(201).redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the inventory addition failed.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add to Inventory",
      nav,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification as JSON
* ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build the edit view
* ************************** */
invCont.buildModifyView = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleByInvId(inv_id)
  const classificationSelect = await utilities.getClassificationsDropDown(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/modify-inventory", {
    title: `Edit ${itemName}`,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
* ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id, } = req.body

  const updateResult = await invModel.updateInventory(
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
  )
  
  if (updateResult) {
    const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`
    req.flash(
      "notice", `The ${itemName} was successfully updated.`
    )
    res.status(201).redirect("/inv/")
  } else {
    const classificationSelect = await utilities.getClassificationsDropDown(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("./inventory/modify-inventory", {
      title: `Edit ${itemName}`,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_color,
      inv_id,
    })
  }
}

/* ***************************
 *  Trigger an intentional error view
* ************************** */
invCont.triggerError = async function (req, res, next) {
  throw new Error("Oh no! There was a crash. Maybe try a different route? ('Intentional 500-level error triggered)")
}

module.exports = invCont