// components/ProductCard.js
'use client';

const ProductCard = ({ product, vendorWhatsapp }) => {
  const handleWhatsapp = () => {
    if (product.whatsappLink) {
      window.open(product.whatsappLink, '_blank');
    }
  };

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e5e5',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.name}
          style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }}
        />
      ) : (
        <div style={{
          width: '100%', aspectRatio: '1/1',
          background: '#f5f5f5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#999', fontSize: '13px'
        }}>
          Pas d'image
        </div>
      )}

      <div style={{ padding: '12px' }}>
        <p style={{ fontSize: '12px', color: '#999', margin: '0 0 4px' }}>
          {product.reference}
        </p>
        <h3 style={{ fontSize: '15px', fontWeight: '600', margin: '0 0 4px', color: '#111' }}>
          {product.name}
        </h3>
        {product.description && (
          <p style={{ fontSize: '13px', color: '#666', margin: '0 0 8px' }}>
            {product.description}
          </p>
        )}
        <p style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 12px', color: '#111' }}>
          {product.price.toLocaleString()} Ar
        </p>

        <button
          onClick={handleWhatsapp}
          style={{
            width: '100%',
            padding: '10px',
            background: '#111',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Commander via WhatsApp
        </button>
      </div>
    </div>
  );
};

export default ProductCard;