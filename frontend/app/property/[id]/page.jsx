'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await fetch(`http://localhost:5000/api/properties/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProperty(data);
        }
      } catch (err) {
        console.error('Error fetching property:', err);
      }
    }
    if (id) fetchProperty();
  }, [id]);

  if (!property) {
    return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</p>;
  }

  return (
    <div className="property-detail">
      <img
        src={property.image}
        alt={property.title}
        className="property-detail-image"
      />
      <div className="property-detail-content">
        <h1>{property.title}</h1>
        <p className="price">₹{property.price.toLocaleString()}</p>
        <p className="location">{property.location}</p>
        <p className="description">{property.description}</p>
      </div>
    </div>
  );
}
