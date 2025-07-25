use rusqlite::{Connection, Result};

pub fn init_db() -> Result<()> {
    
    
    let conn = Connection::open("inventory.db")?;

    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 0
        );
        CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
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
        CREATE TABLE IF NOT EXISTS deleted_products (
            id INTEGER,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            quantity INTEGER NOT NULL,
            deleted_at TEXT NOT NULL
        );
        ",
    )?;

    // Try to add quantity column if it doesn't exist (for migration)
    let _ = conn.execute("ALTER TABLE products ADD COLUMN quantity INTEGER NOT NULL DEFAULT 0", []);

    Ok(())
}
