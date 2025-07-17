// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;
mod models;
mod api;


use tauri::generate_handler;
use tauri::Builder;

fn main() {
    // Initialize DB (create tables if needed)
    db::init_db().expect("Failed to initialize SQLite DB");

    tauri::Builder::default()
        .invoke_handler(generate_handler![
            // Product APIs
            api::product::add_product,
            api::product::get_products,
            api::product::update_product,
            api::product::delete_product,
            api::product::get_product_by_id_and_name,
            api::product::get_deleted_products,
           
            // Billing APIs
            api::bill::create_bill,
            api::bill::get_bills,
        ])
        .run(tauri::generate_context!())
        .expect("Error while running Tauri app");
}