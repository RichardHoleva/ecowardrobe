import { Link } from 'react-router-dom';

export default function ItemCard({ item }) {
  return (
    <article className="card" aria-label={`Wardrobe item ${item.name}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ margin: 0 }}>{item.name}</h3>
          <p style={{ margin: '0.2rem 0', fontSize: '0.85rem', color: '#9ca3af' }}>
            {item.category} · {item.brand_type.replace('_', ' ')}
          </p>
          <p style={{ margin: '0.2rem 0', fontSize: '0.85rem' }}>
            Worn <strong>{item.wear_count}</strong> times
          </p>
        </div>
        <div>
          <Link to={`/item/${item.id}`}>
            <button type="button">Details</button>
          </Link>
        </div>
      </div>
    </article>
  );
}
