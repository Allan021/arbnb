import React, { useState } from "react";
import Button from "@/components/Button";
import { useAuth } from "@/lib/AuthContext";

interface Props {
  property: {
    _id: string;
    pricePerNight: number;
    maxGuests: number;
    rating: number;
    numReviews: number;
  };
}

const BookingCard: React.FC<Props> = ({ property }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const { isAuthenticated } = useAuth();

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      alert("Selecciona las fechas");
      return;
    }

    const nights = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (nights <= 0) {
      alert("Fecha inválida");
      return;
    }

    const url = `/properties/${property._id}/book?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&nights=${nights}`;
    window.location.href = url;
  };

  return (
    <div className="border rounded-lg p-6 shadow-lg sticky top-24">
      <div className="flex justify-between mb-4">
        <span className="text-2xl font-bold">€{property.pricePerNight}</span>
        <span>
          ★ {property.rating} · {property.numReviews} reseñas
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <select
        value={guests}
        onChange={(e) => setGuests(+e.target.value)}
        className="w-full border p-2 rounded mb-4"
      >
        {[...Array(property.maxGuests)].map((_, i) => (
          <option key={i} value={i + 1}>
            {i + 1} huésped{i > 0 ? "es" : ""}
          </option>
        ))}
      </select>

      <Button fullWidth onClick={handleBooking} disabled={!isAuthenticated}>
        {isAuthenticated ? "Reservar" : "Inicia sesión para reservar"}
      </Button>
    </div>
  );
};

export default BookingCard;
