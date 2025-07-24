import { useState } from 'react';

export default function Bill({ itemList, setItemList, shopName = "Example Shop", isActive = false }) {
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
    <div className={`bg-gray-900 text-white p-8 rounded-xl border ${isActive ? 'border-blue-500 shadow-2xl' : 'border-gray-700 shadow'} max-w-3xl mx-auto font-sans transition-all duration-300 print:bg-white print:text-black print:border print:border-gray-300 print:shadow-none`}>
      {/* Active Banner */}
      {isActive && (
        <div className="bg-blue-700 text-white px-4 py-2 rounded-t-xl font-semibold mb-4 text-center print:hidden">
          🎯 Bill Active - Ready for Items
        </div>
      )}
      {/* Print Button */}
      <div className="flex justify-end mb-4 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-green-700 hover:bg-green-600 text-white font-semibold rounded px-4 py-2 transition-colors"
        >
          🖨️ Print Bill
        </button>
      </div>
      {/* Header */}
      <div className="text-center border-b-2 border-gray-700 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-white mb-1">{shopName}</h1>
        <p className="text-gray-300 mb-0">Sales Invoice</p>
        <p className="text-gray-400 text-sm mt-1">Date: {new Date().toLocaleDateString()}</p>
      </div>
      {/* Items Table */}
      <div className="mb-8 overflow-x-auto">
        <table className="w-full bg-gray-800 rounded-lg border border-gray-700">
          <thead>
            <tr className="bg-gray-900">
              <th className="px-4 py-2 text-left text-gray-200">Product</th>
              <th className="px-4 py-2 text-center text-gray-200">Quantity</th>
              <th className="px-4 py-2 text-center text-gray-200">Price</th>
              <th className="px-4 py-2 text-center text-gray-200">Total</th>
              <th className="px-4 py-2 text-center text-gray-200 print:hidden">Actions</th>
            </tr>
          </thead>
          <tbody>
            {itemList.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-400">No items in bill</td>
              </tr>
            ) : (
              itemList.map((item, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="px-4 py-2 font-semibold">{item.name}</td>
                  <td className="px-4 py-2 text-center">
                    {editingItem === index ? (
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(index, 'quantity', e.target.value)}
                        className="w-16 px-2 py-1 rounded bg-gray-900 text-white border border-gray-600 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      item.quantity
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {editingItem === index ? (
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handleUpdateItem(index, 'price', e.target.value)}
                        className="w-24 px-2 py-1 rounded bg-gray-900 text-white border border-gray-600 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      `$${item.price.toFixed(2)}`
                    )}
                  </td>
                  <td className="px-4 py-2 text-center font-bold">${(item.price * item.quantity).toFixed(2)}</td>
                  <td className="px-4 py-2 text-center print:hidden">
                    {editingItem === index ? (
                      <button
                        onClick={() => handleSaveItem(index)}
                        className="bg-green-700 hover:bg-green-600 text-white font-semibold rounded px-3 py-1 mr-2"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditItem(index)}
                        className="bg-blue-700 hover:bg-blue-600 text-white font-semibold rounded px-3 py-1 mr-2"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="bg-red-700 hover:bg-red-600 text-white font-semibold rounded px-3 py-1"
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
      
      <div className="border-t-2 border-gray-700 pt-6 flex flex-col items-end gap-2">
        <div className="text-white">Subtotal: <span className="font-bold">${subtotal.toFixed(2)}</span></div>
        <div className="text-white">Tax (19%): <span className="font-bold">${tax.toFixed(2)}</span></div>
        <div className="text-white text-lg font-bold">Total: ${total.toFixed(2)}</div>
      </div>
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\:bg-white, .print\:bg-white * {
            background: #fff !important;
            color: #000 !important;
          }
          .print\:text-black, .print\:text-black * {
            color: #000 !important;
          }
          .print\:border, .print\:border * {
            border-color: #ccc !important;
          }
          .print\:shadow-none, .print\:shadow-none * {
            box-shadow: none !important;
          }
          .print\:hidden, .print\:hidden * {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
} 