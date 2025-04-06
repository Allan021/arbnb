import React from "react";
import Link from "next/link";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  dates: string;
  price: number;
  rating: number;
  imageUrl?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  location,
  dates,
  price,
  rating,
  imageUrl,
}) => {
  return (
    <Link href={`/properties/${id}`}>
      <div className="card hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative h-64 w-full bg-gray-200 rounded-t-lg overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              Imagen no disponible
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">{title}</h3>
            <div className="flex items-center">
              <span className="mr-1">★</span>
              <span>{rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-gray-600 mb-2">{location}</p>
          <p className="text-gray-600 mb-4">{dates}</p>
          <p>
            <span className="font-bold">${price}</span> noche
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
