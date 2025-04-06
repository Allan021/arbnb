"use client";

import Image from "next/image";
import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState } from "react";

type Property = {
  _id: string;
  title: string;
  rating: number;
  address: {
    city: string;
    country: string;
  };
  pricePerNight: number;
  images: string[];
};

type Props = {
  property: Property;
};

export const PropertyCard = ({ property }: Props) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  const totalSlides = Math.min(property.images.length, 5);

  const nextSlide = () => {
    instanceRef.current?.next();
  };

  const prevSlide = () => {
    instanceRef.current?.prev();
  };

  return (
    <Link
      key={property._id}
      href={`/properties/${property._id}`}
      style={{ borderRadius: "1rem" }}
      className="card hover:shadow-lg transition-shadow border overflow-hidden bg-white"
    >
      <div className="relative h-64 w-full">
        {/* Slider de imágenes */}
        <div ref={sliderRef} className="keen-slider h-full">
          {property.images.slice(0, 5).map((img, index) => (
            <div key={index} className="keen-slider__slide relative h-full">
              <Image
                src={img}
                alt={`${property.title} ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Botones Prev y Next */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            prevSlide();
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition"
        >
          <span className="text-xl font-bold text-gray-700">‹</span>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            nextSlide();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition"
        >
          <span className="text-xl font-bold text-gray-700">›</span>
        </button>

        {/* Indicadores (puntos) */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <span
              key={i}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? "bg-white shadow-md"
                  : "bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Info de la propiedad */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg">{property.title}</h3>
          <div className="flex items-center text-yellow-500 font-semibold">
            <span className="mr-1">★</span>
            <span>{property.rating}</span>
          </div>
        </div>
        <p className="text-gray-600 mb-2">
          {property.address.city}, {property.address.country}
        </p>
        <p className="text-gray-600 mb-4">Fechas flexibles</p>
        <p>
          <span className="font-bold">COP$ {property.pricePerNight}</span> noche
        </p>
      </div>
    </Link>
  );
};
