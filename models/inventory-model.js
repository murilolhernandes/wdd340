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

async function checkExistingClass(classification_name) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.classification WHERE ${classification_name} = $1`, [classification_name]
    )
    return data.rowCount
  } catch (error) {
    return error.message
  }
}

async function addInventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color){
  try {
    const data = await pool.query(
      `INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
      return data
  } catch (error) {
    return error.message
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByClassificationId, getVehicleByInvId, getClassificationNameById, addClassification, addInventory, checkExistingClass};
