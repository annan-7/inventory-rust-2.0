use rusqlite::{params, Connection, Result};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct BillItem {
    pub product_name: String,
    pub quantity: i32,
    pub price_per_item: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Bill {
    pub id: i32,
    pub date: String,
    pub total: f64,
    pub items: Vec<BillItem>,
}

impl Bill {
    
    pub fn list(conn: &Connection) -> Result<Vec<Bill>> {
        let mut stmt = conn.prepare("SELECT id, date, total FROM bills ORDER BY id DESC")?;
        let rows = stmt.query_map([], |row| {
            Ok(Bill {
                id: row.get(0)?,
                date: row.get(1)?,
                total: row.get(2)?,
                items: vec![], // filled separately
            })
        })?;

        let mut bills = vec![];
        for bill in rows {
            let mut b = bill?;
            b.items = Bill::get_items(conn, b.id as i64)?;

            bills.push(b);
        }

        Ok(bills)
    }

    pub fn create(conn: &mut Connection, items: Vec<BillItem>) -> Result<i64> {
    let tx = conn.transaction()?;  // now works because conn is &mut

    let mut total = 0.0;

    for item in &items {
        total += item.quantity as f64 * item.price_per_item;
    }

    tx.execute(
        "INSERT INTO bills (date, total) VALUES (datetime('now'), ?1)",
        [total],
    )?;

    let bill_id = tx.last_insert_rowid();

    for item in &items {
        tx.execute(
            "INSERT INTO bill_items (bill_id, product_name, quantity, price_per_item)
             VALUES (?1, ?2, ?3, ?4)",
            (
                bill_id,
                &item.product_name,
                item.quantity,
                item.price_per_item,
            ),
        )?;
    }

    tx.commit()?;

    Ok(bill_id)
}

}
