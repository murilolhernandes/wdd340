const pool = require("../database/")

/* ***************************
 *  Get all classification data
  * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name") 
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
* ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get each inventory item by classification_name by classification_id
* ************************** */
async function getVehicleByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error(`getvehiclebyinvid error ${error}`)
  }
}

/* ***************************
 *  Get classification name by classification_id
* ************************** */
async function getClassificationNameById(classification_id) {
  try {
    const data = await pool.query(
      `SELECT classification_name FROM public.classification WHERE classification_id = $1`,
      [classification_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getclassificationnamebyid error " + error)
  }
}

/* ***************************
 *  Add classification name
* ************************** */
async function addClassification(classification_name) {
  try {
    const data = await pool.query(
      "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *", [classification_name]
    )
    return data
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Add inventory by classification_name
* ************************** */
async function addInventory(classification_name) {
  try {
    const data = await pool.query(
      "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *", [classification_name]
    )
    return data
  } catch (error) {
    return error.message
  }
}
module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByClassificationId, getVehicleByInvId, getClassificationNameById, addClassification, addInventory};
