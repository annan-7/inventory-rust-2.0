use rusqlite::Connection;
use crate::models::product::Product;
use crate::models::product::DeletedProduct;
use tauri::command;


#[tauri::command]
pub fn add_product(name: String, price: f64, quantity: i32) -> Result<(), String> {
    let conn = Connection::open("inventory.db").map_err(|e| e.to_string())?;
    Product::create(&conn, name, price, quantity).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_products() -> Result<Vec<Product>, String> {
    let conn = Connection::open("inventory.db").map_err(|e| e.to_string())?;
    Product::get_all(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_product(id: i32, name: String, price: f64, quantity: i32) -> Result<(), String> {
    let conn = Connection::open("inventory.db").map_err(|e| e.to_string())?;
    Product::update(&conn, id, name, price, quantity).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_product(id: i32) -> Result<(), String> {
    let conn = Connection::open("inventory.db").map_err(|e| e.to_string())?;
    Product::delete(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_product_by_id_and_name(id: i32, name: String) -> Result<Option<Product>, String> {
    let conn = Connection::open("inventory.db").map_err(|e| e.to_string())?;
    Product::get_by_id_and_name(&conn, id, &name).map_err(|e| e.to_string())
}


#[tauri::command]
pub fn get_deleted_products() -> Result<Vec<DeletedProduct>, String> {
    let conn = Connection::open("inventory.db").map_err(|e| e.to_string())?;
    DeletedProduct::get_all(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_product_by_id(id: i32) -> Result<Option<Product>, String> {
    let conn = Connection::open("inventory.db").map_err(|e| e.to_string())?;
    Product::get_by_id(&conn, id).map_err(|e| e.to_string())
}


