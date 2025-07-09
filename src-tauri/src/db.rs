use rusqlite::{Connection, Result};

pub fn init_db() -> Result<()> {
    let conn = Connection::open("inventory.db")?;

    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL
        );
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
