use rusqlite::{params, Connection, Result};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Product {
    pub id: i32,
    pub name: String,
    pub price: f64,
}

impl Product {
    pub fn create(conn: &Connection, name: String, price: f64) -> Result<()> {
        conn.execute(
            "INSERT INTO products (name, price) VALUES (?1, ?2)",
            params![name, price],
        )?;
        Ok(())
    }

    pub fn get_all(conn: &Connection) -> Result<Vec<Product>> {
        let mut stmt = conn.prepare("SELECT id, name, price FROM products")?;
        let products = stmt
            .query_map([], |row| {
                Ok(Product {
                    id: row.get(0)?,
                    name: row.get(1)?,
                    price: row.get(2)?,
                })
            })?
            .collect::<Result<Vec<Product>>>()?;
        Ok(products)
    }

    pub fn update(conn: &Connection, id: i32, name: String, price: f64) -> Result<()> {
        conn.execute(
            "UPDATE products SET name = ?1, price = ?2 WHERE id = ?3",
            params![name, price, id],
        )?;
        Ok(())
    }

    pub fn delete(conn: &Connection, id: i32) -> Result<()> {
        conn.execute("DELETE FROM products WHERE id = ?1", params![id])?;
        Ok(())
    }
}
