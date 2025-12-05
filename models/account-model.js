const pool = require("../database/")

/* ***************************
 *  Get all classification data
* ************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = "INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing email
* ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM public.account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Return account data using email address
* ********************* */
async function getAccountByEmail(account_email){
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM public.account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* **********************
 *   Return account data using account id
* ********************* */
async function getAccountById(account_id){
  try {
    const result = await pool.query(
      'SELECT * FROM public.account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* **********************
 *   Update Account Data
* ********************* */
async function updateAccount(account_firstname, account_lastname, account_email, account_id){
  try {
    const data = await pool.query(
      `UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *`,
      [account_firstname, account_lastname, account_email, account_id])
      return data.rows[0]
  } catch (error) {
    console.error(`model error: ${error}`)
  }
}

/* **********************
 *   Update Password
* ********************* */
async function updateAccountPassword(account_password, account_id){
  try {
    const data = await pool.query(
      `UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *`,
      [account_password, account_id])
      return data.rows[0]
  } catch (error) {
    console.error(`model error: ${error}`)
  }
}

/* ***************************
 *  Get account data
  * ************************** */
async function getAccountByType(account_type){
  try {
    const data = await pool.query("SELECT * FROM public.account WHERE account_type = $1 ORDER BY account_type", [account_type])
    return data.rows
  } catch (error) {
    console.error("getaccountbytype " + error)
  }
}

/* ***************************
 *  Get all account data
  * ************************** */
async function getAccountTypes() {
  return await pool.query("SELECT unnest AS account_type FROM unnest(enum_range(NULL::account_type)) WHERE unnest <> 'SuperAdmin'")
}

/* ***************************
 *  Check if the account type already exists by account type
  * ************************** */
async function checkExistingAccountType(account_type) {
  try {
    const data = await pool.query(
      "SELECT 1 FROM unnest(enum_range(NULL::account_type)) WHERE unnest = $1 AND unnest <> 'SuperAdmin'", [account_type]
    )
    return data.rowCount
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Update User Account Data
* ********************* */
async function updateUserAccount(account_firstname, account_lastname, account_email, account_type, account_id){
  try {
    const data = await pool.query(
      `UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3, account_type = $4 WHERE account_id = $5 RETURNING *`,
      [account_firstname, account_lastname, account_email, account_type, account_id])
      return data.rows[0]
  } catch (error) {
    console.error(`model error: ${error}`)
  }
}

module.exports = { registerAccount, checkExistingEmail, getAccountById, getAccountByEmail, updateAccount, updateAccountPassword, getAccountByType, getAccountTypes, checkExistingAccountType, updateUserAccount }
