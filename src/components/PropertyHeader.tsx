import React from 'react';

interface Props {
  property: {
    title: string;
    rating: number;
    numReviews: number;
    address: { city: string; country: string };
  };
}

const PropertyHeader: React.FC<Props> = ({ property }) => (
  <div className="mb-6">
    <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
    <div className="flex items-center text-gray-600">
      <span>★ {property.rating}</span>
      <span className="mx-2">·</span>
      <span className="underline">{property.numReviews} reseñas</span>
      <span className="mx-2">·</span>
      <span>{property.address.city}, {property.address.country}</span>
    </div>
  </div>
);

export default PropertyHeader;
