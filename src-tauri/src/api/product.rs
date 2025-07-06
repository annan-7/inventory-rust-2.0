use rusqlite::Connection;
use crate::models::product::Product;

#[tauri::command]
pub fn add_product(name: String, price: f64) -> Result<(), String> {
    let conn = Connection::open("src-tauri/inventory.db").map_err(|e| e.to_string())?;
    Product::create(&conn, name, price).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_products() -> Result<Vec<Product>, String> {
    let conn = Connection::open("src-tauri/inventory.db").map_err(|e| e.to_string())?;
    Product::get_all(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_product(id: i32, name: String, price: f64) -> Result<(), String> {
    let conn = Connection::open("src-tauri/inventory.db").map_err(|e| e.to_string())?;
    Product::update(&conn, id, name, price).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_product(id: i32) -> Result<(), String> {
    let conn = Connection::open("src-tauri/inventory.db").map_err(|e| e.to_string())?;
    Product::delete(&conn, id).map_err(|e| e.to_string())
}
