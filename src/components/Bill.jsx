import { useState } from 'react';

export default function Bill({ itemList, setItemList, shopName = "Example Shop" }) {
  const [editingItem, setEditingItem] = useState(null);

  const handleEditItem = (index) => {
    setEditingItem(index);
  };

  const handleSaveItem = (index) => {
    setEditingItem(null);
  };

  const handleUpdateItem = (index, field, value) => {
    const updatedList = [...itemList];
    if (field === 'price') {
      updatedList[index].price = parseFloat(value) || 0;
    } else if (field === 'quantity') {
      updatedList[index].quantity = parseInt(value) || 0;
    }
    setItemList(updatedList);
  };

  const handleRemoveItem = (index) => {
    setItemList(itemList.filter((_, i) => i !== index));
  };

  const handlePrint = () => {
    window.print();
  };

  const subtotal = itemList.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.19; // 19% tax
  const total = subtotal + tax;

  return (
    <div style={{ 
      background: '#fff', 
      border: '1px solid #ddd', 
      borderRadius: 8, 
      padding: 24, 
      maxWidth: 800, 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Print Button */}
      <div style={{ textAlign: 'right', marginBottom: 16 }}>
        <button
          onClick={handlePrint}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          🖨️ Print Bill
        </button>
      </div>

      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        borderBottom: '2px solid #333', 
        paddingBottom: 16, 
        marginBottom: 24 
      }}>
        <h1 style={{ margin: 0, color: '#333', fontSize: 28 }}>{shopName}</h1>
        <p style={{ margin: '8px 0 0 0', color: '#666' }}>Sales Invoice</p>
        <p style={{ margin: '4px 0 0 0', color: '#666' }}>Date: {new Date().toLocaleDateString()}</p>
      </div>

      {/* Items Table */}
      <div style={{ marginBottom: 24 }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          border: '1px solid #ddd'
        }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>Product</th>
              <th style={{ padding: 12, textAlign: 'center', border: '1px solid #ddd' }}>Quantity</th>
              <th style={{ padding: 12, textAlign: 'center', border: '1px solid #ddd' }}>Price</th>
              <th style={{ padding: 12, textAlign: 'center', border: '1px solid #ddd' }}>Total</th>
              <th style={{ padding: 12, textAlign: 'center', border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {itemList.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: 24, textAlign: 'center', color: '#666' }}>
                  No items in bill
                </td>
              </tr>
            ) : (
              itemList.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: 12, border: '1px solid #ddd' }}>
                    <strong>{item.name}</strong>
                  </td>
                  <td style={{ padding: 12, textAlign: 'center', border: '1px solid #ddd' }}>
                    {editingItem === index ? (
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(index, 'quantity', e.target.value)}
                        style={{
                          width: 60,
                          padding: 4,
                          border: '1px solid #ddd',
                          borderRadius: 4,
                          textAlign: 'center'
                        }}
                      />
                    ) : (
                      item.quantity
                    )}
                  </td>
                  <td style={{ padding: 12, textAlign: 'center', border: '1px solid #ddd' }}>
                    {editingItem === index ? (
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handleUpdateItem(index, 'price', e.target.value)}
                        style={{
                          width: 80,
                          padding: 4,
                          border: '1px solid #ddd',
                          borderRadius: 4,
                          textAlign: 'center'
                        }}
                      />
                    ) : (
                      `$${item.price.toFixed(2)}`
                    )}
                  </td>
                  <td style={{ padding: 12, textAlign: 'center', border: '1px solid #ddd' }}>
                    <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                  </td>
                  <td style={{ padding: 12, textAlign: 'center', border: '1px solid #ddd' }}>
                    {editingItem === index ? (
                      <button
                        onClick={() => handleSaveItem(index)}
                        style={{
                          background: '#28a745',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: 4,
                          cursor: 'pointer',
                          marginRight: 4
                        }}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditItem(index)}
                        style={{
                          background: '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: 4,
                          cursor: 'pointer',
                          marginRight: 4
                        }}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveItem(index)}
                      style={{
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: 4,
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div style={{ 
        borderTop: '2px solid #333', 
        paddingTop: 16,
        textAlign: 'right'
      }}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontWeight: 'bold', marginRight: 16 }}>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontWeight: 'bold', marginRight: 16 }}>Tax (19%):</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div style={{ 
          fontSize: 18, 
          fontWeight: 'bold', 
          borderTop: '1px solid #ddd', 
          paddingTop: 8 
        }}>
          <span style={{ marginRight: 16 }}>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .bill-content, .bill-content * {
            visibility: visible;
          }
          .bill-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
} 