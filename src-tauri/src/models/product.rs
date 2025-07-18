use rusqlite::{params, Connection, Result};
use serde::{Deserialize, Serialize};
use chrono::Local;

#[derive(Debug, Serialize, Deserialize)]
pub struct Product {
    pub id: i32,
    pub name: String,
    pub price: f64,
    pub quantity: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DeletedProduct {
    pub id: i32,
    pub name: String,
    pub price: f64,
    pub quantity: i32,
    pub deleted_at: String,
}

impl Product {
    pub fn create(conn: &Connection, name: String, price: f64, quantity: i32) -> Result<()> {
        conn.execute(
            "INSERT INTO products (name, price, quantity) VALUES (?1, ?2, ?3)",
            params![name, price, quantity],
        )?;
        Ok(())
    }

    pub fn get_all(conn: &Connection) -> Result<Vec<Product>> {
        let mut stmt = conn.prepare("SELECT id, name, price, quantity FROM products")?;
        let products = stmt
            .query_map([], |row| {
                Ok(Product {
                    id: row.get(0)?,
                    name: row.get(1)?,
                    price: row.get(2)?,
                    quantity: row.get(3)?,
                })
            })?
            .collect::<Result<Vec<Product>>>()?;
        Ok(products)
    }

    pub fn update(conn: &Connection, id: i32, name: String, price: f64, quantity: i32) -> Result<()> {
        conn.execute(
            "UPDATE products SET name = ?1, price = ?2, quantity = ?3 WHERE id = ?4",
            params![name, price, quantity, id],
        )?;
        Ok(())
    }

    pub fn delete(conn: &Connection, id: i32) -> Result<()> {
        // Get product details before deleting
        let mut stmt = conn.prepare("SELECT id, name, price, quantity FROM products WHERE id = ?1")?;
        let mut rows = stmt.query(params![id])?;
        if let Some(row) = rows.next()? {
            let id: i32 = row.get(0)?;
            let name: String = row.get(1)?;
            let price: f64 = row.get(2)?;
            let quantity: i32 = row.get(3)?;
            let deleted_at = Local::now().format("%Y-%m-%d %H:%M:%S").to_string();
            conn.execute(
                "INSERT INTO deleted_products (id, name, price, quantity, deleted_at) VALUES (?1, ?2, ?3, ?4, ?5)",
                params![id, name, price, quantity, deleted_at],
            )?;
        }
        conn.execute("DELETE FROM products WHERE id = ?1", params![id])?;
        Ok(())
    }

    pub fn get_by_id_and_name(conn: &Connection, id: i32, name: &str) -> Result<Option<Product>> {
        let mut stmt = conn.prepare("SELECT id, name, price, quantity FROM products WHERE id = ?1 AND name = ?2 LIMIT 1")?;
        let mut rows = stmt.query(params![id, name])?;
        if let Some(row) = rows.next()? {
            Ok(Some(Product {
                id: row.get(0)?,
                name: row.get(1)?,
                price: row.get(2)?,
                quantity: row.get(3)?,
            }))
        } else {
            Ok(None)
        }
    }

    pub fn get_by_id(conn: &Connection, id: i32) -> Result<Option<Product>> {
        let mut stmt = conn.prepare("SELECT id, name, price, quantity FROM products WHERE id = ?1 LIMIT 1")?;
        let mut rows = stmt.query(params![id])?;
        if let Some(row) = rows.next()? {
            Ok(Some(Product {
                id: row.get(0)?,
                name: row.get(1)?,
                price: row.get(2)?,
                quantity: row.get(3)?,
            }))
        } else {
            Ok(None)
        }
    }
}

impl DeletedProduct {
    pub fn get_all(conn: &Connection) -> Result<Vec<DeletedProduct>> {
        let mut stmt = conn.prepare("SELECT id, name, price, quantity, deleted_at FROM deleted_products ORDER BY deleted_at DESC")?;
        let products = stmt
            .query_map([], |row| {
                Ok(DeletedProduct {
                    id: row.get(0)?,
                    name: row.get(1)?,
                    price: row.get(2)?,
                    quantity: row.get(3)?,
                    deleted_at: row.get(4)?,
                })
            })?
            .collect::<Result<Vec<DeletedProduct>>>()?;
        Ok(products)
    }
}
