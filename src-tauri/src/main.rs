// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rusqlite::{Connection, params};

use serde::{Deserialize, Serialize};

#[derive(serde::Serialize)]
struct Product {
    id: i32,
    name: String,
    price: f64,
}

// This runs when the app starts
fn init_db() -> Connection {
    let conn = Connection::open("inventory.db").expect("Failed to open DB");

    conn.execute(
        "CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL
        )",
        [],
    ).unwrap();

    conn
}

// Example: add product
#[tauri::command]
fn add_product(name: String, price: f64) -> Result<(), String> {
    let conn = Connection::open("inventory.db").map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO products (name, price) VALUES (?1, ?2)",
        params![name, price],
    ).map_err(|e| e.to_string())?;

    Ok(())
}

// Example: get products
#[tauri::command]
fn get_products() -> Result<Vec<Product>, String> {
    let conn = Connection::open("inventory.db").map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT id, name, price FROM products").map_err(|e| e.to_string())?;
    
    let products = stmt.query_map([], |row| {
        Ok(Product {
            id: row.get(0)?,
            name: row.get(1)?,
            price: row.get(2)?,
        })
    })
    .map_err(|e| e.to_string())?
    .collect::<Result<Vec<Product>, _>>()
    .map_err(|e| e.to_string())?;

    Ok(products)
}

// Start Tauri
fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            init_db();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![add_product, get_products])
        .run(tauri::generate_context!())
        .expect("error while running Tauri");
}
