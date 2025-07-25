use rusqlite::Connection;
use crate::models::bill::{Bill, BillItem};
use tauri::command;


#[tauri::command]
pub fn create_bill(items: Vec<BillItem>) -> Result<i64, String> {
    let mut conn = Connection::open("inventory.db").map_err(|e| e.to_string())?;
    Bill::create(&mut conn, items).map_err(|e| e.to_string())
}



#[tauri::command]
pub fn get_bills() -> Result<Vec<Bill>, String> {
    let conn = Connection::open("inventory.db").map_err(|e| e.to_string())?;
    Bill::list(&conn).map_err(|e| e.to_string())
}
