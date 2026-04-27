import React, { useState, useEffect } from 'react';
import { Package, Plus, AlertTriangle, RefreshCw, Trash2, Search } from 'lucide-react';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    itemName: '',
    category: 'Medicine',
    stock: 0,
    unit: 'Tabs',
    expiryDate: '',
    price: 0
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/inventory');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setShowForm(false);
        fetchInventory();
        setForm({ itemName: '', category: 'Medicine', stock: 0, unit: 'Tabs', expiryDate: '', price: 0 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = items.filter(item => 
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (stock) => {
    if (stock <= 0) return { label: 'Out of Stock', color: '#ef4444', bg: '#fee2e2' };
    if (stock < 20) return { label: 'Low Stock', color: '#f59e0b', bg: '#fef3c7' };
    return { label: 'In Stock', color: '#10b981', bg: '#d1fae5' };
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>Inventory & Pharmacy</h1>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Manage hospital supplies and medicine stock levels.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={20} /> Add New Item
        </button>
      </div>

      {showForm && (
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', border: '1px solid var(--primary-color)' }}>
          <h3 style={{ margin: '0 0 20px 0' }}>Register New Inventory Item</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>Item Name</label>
              <input 
                type="text" 
                required 
                placeholder="Paracetamol 500mg" 
                value={form.itemName} 
                onChange={e => setForm({...form, itemName: e.target.value})} 
                className="form-input" 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>Category</label>
              <select 
                value={form.category} 
                onChange={e => setForm({...form, category: e.target.value})} 
                className="form-input"
              >
                <option value="Medicine">Medicine</option>
                <option value="Equipment">Equipment</option>
                <option value="Consumable">Consumable</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>Current Stock</label>
              <input 
                type="number" 
                required 
                value={form.stock} 
                onChange={e => setForm({...form, stock: parseInt(e.target.value)})} 
                className="form-input" 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>Unit</label>
              <input 
                type="text" 
                placeholder="Tabs / Bottles" 
                value={form.unit} 
                onChange={e => setForm({...form, unit: e.target.value})} 
                className="form-input" 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>Price (per unit)</label>
              <input 
                type="number" 
                required 
                value={form.price} 
                onChange={e => setForm({...form, price: parseFloat(e.target.value)})} 
                className="form-input" 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>Expiry Date</label>
              <input 
                type="date" 
                value={form.expiryDate} 
                onChange={e => setForm({...form, expiryDate: e.target.value})} 
                className="form-input" 
              />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Item</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by name or category..." 
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={fetchInventory} className="nav-item" style={{ padding: '10px', background: 'var(--bg-color)' }}>
            <RefreshCw size={18} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Item Details</th>
                <th style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Price</th>
                <th style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Stock Level</th>
                <th style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Expiry</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center' }}>Loading inventory...</td></tr>
              ) : filteredItems.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center' }}>No items found.</td></tr>
              ) : filteredItems.map(item => {
                const status = getStockStatus(item.stock);
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '600' }}>{item.itemName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: INV-{item.id + 100}</div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ fontSize: '0.85rem', padding: '4px 10px', borderRadius: '20px', background: 'var(--gradient-bg-1)', color: 'var(--primary-color)' }}>
                        {item.category}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontWeight: '600' }}>₹{item.price}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontSize: '1rem', fontWeight: '700' }}>{item.stock} <span style={{ fontSize: '0.8rem', fontWeight: '400', color: 'var(--text-muted)' }}>{item.unit}</span></div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', background: status.bg, color: status.color }}>
                        {status.label}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: item.expiryDate && new Date(item.expiryDate) < new Date() ? '#ef4444' : 'var(--text-main)' }}>
                      {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString('en-GB') : '-'}
                      {item.expiryDate && new Date(item.expiryDate) < new Date() && (
                        <div style={{ fontSize: '0.7rem', fontWeight: '700' }}>EXPIRED</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
