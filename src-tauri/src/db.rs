
use rusqlite::{Connection, Result};
use tauri::path::app_data_dir;
use std::fs;
use std::path::PathBuf;

pub fn init_db() -> Result<()> {
    // Get safe app-specific storage path
    let db_path: PathBuf = app_data_dir().unwrap().join("inventory.db");

    // Create parent directory if missing
    if let Some(parent) = db_path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| rusqlite::Error::ToSqlConversionFailure(Box::new(e)))?;
    }

    // Open database connection
    let conn = Connection::open(&db_path)?;

    // Create tables if not exist
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS bills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            total REAL NOT NULL
        );
        CREATE TABLE IF NOT EXISTS bill_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bill_id INTEGER NOT NULL,
            product_name TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            price_per_item REAL NOT NULL,
            FOREIGN KEY (bill_id) REFERENCES bills(id)
        );
        ",
    )?;

    Ok(())
}
