// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle information by vehicle view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByVehicleId));

// Route to build sever error view
router.get("/trigger-error", utilities.handleErrors(invController.triggerError));

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Route to build add-classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView));

// Route to build add-inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView));

module.exports = router;