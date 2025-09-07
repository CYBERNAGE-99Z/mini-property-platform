'use client';
import Link from 'next/link';

export default function PropertyCard({ property }) {
  return (
    <div className="property-card">
      <img src={property.image} alt={property.title} />
      <div className="property-card-body">
        <h3>{property.title}</h3>
        <p>{property.location}</p>
        <div className="property-card-footer">
          <span className="price">₹{property.price.toLocaleString()}</span>
          <Link href={`/property/${property._id}`} className="view-link">View</Link>
        </div>
      </div>
    </div>
  );
}
