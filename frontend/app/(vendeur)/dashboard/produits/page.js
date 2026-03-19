'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '../../../../lib/auth';
import api from '../../../../lib/api';

export default function ProduitsPage() {
  const router = useRouter();
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState(null);
  const [error, setError]         = useState('');
  const [saving, setSaving]       = useState(false);
  const [form, setForm] = useState({
    name: '', reference: '', price: '', description: '', imageUrl: ''
  });

  useEffect(() => {
    const session = getSession();
    if (!session) { router.push('/login'); return; }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data.products);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: '', reference: '', price: '', description: '', imageUrl: '' });
    setEditing(null);
    setError('');
  };

  const openAdd = () => { resetForm(); setShowForm(true); };

  const openEdit = (p) => {
    setForm({
      name: p.name, reference: p.reference,
      price: p.price, description: p.description || '',
      imageUrl: p.image_url || ''
    });
    setEditing(p.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    setError('');
    if (!form.name || !form.price) {
      setError('Nom et prix requis.'); return;
    }
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/products/${editing}`, {
          name: form.name, reference: form.reference,
          price: parseInt(form.price), description: form.description,
          imageUrl: form.imageUrl
        });
      } else {
        await api.post('/products', {
          name: form.name, reference: form.reference,
          price: parseInt(form.price), description: form.description,
          imageUrl: form.imageUrl
        });
      }
      await fetchProducts();
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch {
      alert('Erreur lors de la suppression.');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const { data } = await api.post('/upload/product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm(f => ({ ...f, imageUrl: data.imageUrl }));
    } catch {
      setError("Erreur lors de l'upload de l'image.");
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    border: '1px solid #e5e5e5', borderRadius: '6px',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box'
  };

  const labelStyle = {
    fontSize: '13px', fontWeight: '500',
    color: '#333', display: 'block', marginBottom: '6px'
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#999', fontSize: '14px' }}>Chargement...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: 'system-ui, sans-serif' }}>

      {/* Navbar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
        <a href="/dashboard" style={{ fontWeight: '700', fontSize: '16px', color: '#111', textDecoration: 'none' }}>Keyros</a>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="/dashboard" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>Accueil</a>
          <a href="/dashboard/stats" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>Stats</a>
          <a href="/dashboard/profil" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>Profil</a>
        </div>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111', margin: '0 0 4px' }}>Produits</h1>
            <p style={{ fontSize: '13px', color: '#999', margin: 0 }}>{products.length} article(s) dans votre catalogue</p>
          </div>
          <button
            onClick={openAdd}
            style={{ padding: '9px 18px', background: '#111', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
          >
            Ajouter un produit
          </button>
        </div>

        {/* Formulaire ajout/modif */}
        {showForm && (
          <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111', margin: '0 0 20px' }}>
              {editing ? 'Modifier le produit' : 'Nouveau produit'}
            </h2>

            {error && (
              <div style={{ padding: '10px 12px', background: '#fff0f0', border: '1px solid #fcc', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', color: '#c00' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Nom du produit</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Robe fleurie"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Reference{' '}
                  <span style={{ color: '#999', fontWeight: '400' }}>(auto si vide)</span>
                </label>
                <input
                  type="text"
                  value={form.reference}
                  onChange={e => setForm({ ...form, reference: e.target.value })}
                  placeholder="Ex: REF-001"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Prix (Ariary)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  placeholder="Ex: 25000"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Description (optionnel)</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Courte description"
                  style={inputStyle}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Image du produit</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ fontSize: '13px', color: '#555' }}
                />
                {form.imageUrl && (
                  <img
                    src={form.imageUrl}
                    alt="preview"
                    style={{ marginTop: '10px', width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e5e5' }}
                  />
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ padding: '9px 18px', background: saving ? '#999' : '#111', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: saving ? 'not-allowed' : 'pointer' }}
              >
                {saving ? 'Sauvegarde...' : (editing ? 'Mettre a jour' : 'Ajouter')}
              </button>
              <button
                onClick={() => { setShowForm(false); resetForm(); }}
                style={{ padding: '9px 18px', background: '#fff', color: '#555', border: '1px solid #e5e5e5', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Liste produits */}
        {products.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '48px', textAlign: 'center' }}>
            <p style={{ color: '#999', fontSize: '14px', margin: '0 0 16px' }}>
              Vous n'avez pas encore de produits.
            </p>
            <button
              onClick={openAdd}
              style={{ padding: '9px 18px', background: '#111', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
            >
              Ajouter votre premier produit
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {products.map(p => (
              <div
                key={p.id}
                style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: '56px', height: '56px', background: '#f5f5f5', borderRadius: '6px', flexShrink: 0 }} />
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#111', margin: '0 0 2px' }}>{p.name}</p>
                  <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>{p.reference} - {p.price.toLocaleString()} Ar</p>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => openEdit(p)}
                    style={{ padding: '7px 14px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '6px', fontSize: '12px', color: '#333', cursor: 'pointer' }}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{ padding: '7px 14px', background: '#fff', border: '1px solid #fcc', borderRadius: '6px', fontSize: '12px', color: '#c00', cursor: 'pointer' }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}