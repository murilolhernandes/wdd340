// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle information by vehicle view
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByVehicleId));

// Route to build sever error view
router.get("/trigger-error", utilities.handleErrors(invController.triggerError));

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Route to build add-classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView));

// Route to build add-inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView));

// Route to post the classification
router.post("/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.buildAddClassificationForm));

// Route to post the inventory
router.post("/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.buildAddInventoryForm));

// Route to build the inventory for AJAX route
router.get("/getInventory/:classification_id",
  // invValidate.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON));

// Route to build the modify inventory view
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildModifyView));

// Route to post the modification form
router.post("/update/",
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory));

// Route to build the modify inventory view
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteConfirmationView));

// Route to post the delete inventory
router.post("/delete/",
  utilities.handleErrors(invController.deleteInventory));

// Route to build server error page
// router.get("/trigger-error", utilities.handleErrors(invController.triggerError));

module.exports = router;