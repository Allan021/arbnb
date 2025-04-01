"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { useAuth } from "@/lib/AuthContext";
import { propertyService, reviewService } from "@/lib/api";

export default function PropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [reviews, setReviews] = useState([]);

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const propertyData = await propertyService.getPropertyById(params.id);
        setProperty(propertyData);

        const reviewsData = await reviewService.getPropertyReviews(params.id);
        setReviews(reviewsData);
      } catch (err) {
        setError("Error al cargar los detalles de la propiedad");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [params.id]);

  const handleBooking = () => {
    if (!checkInDate || !checkOutDate) {
      alert("Por favor selecciona las fechas de entrada y salida");
      return;
    }

    // Calcular el número de noches
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      alert("La fecha de salida debe ser posterior a la fecha de entrada");
      return;
    }

    // Redirigir a la página de reserva con los parámetros
    window.location.href = `/properties/${params.id}/book?checkIn=${checkInDate}&checkOut=${checkOutDate}&guests=${guestCount}&nights=${nights}`;
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <p>Cargando detalles de la propiedad...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="flex min-h-screen flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">
              {error || "No se pudo encontrar la propiedad"}
            </span>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Header isLoggedIn={isAuthenticated} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{property.title}</h1>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <span className="mr-1">★</span>
            <span className="font-semibold">{property.rating}</span>
            <span className="mx-1">·</span>
            <span className="underline">{property.numReviews} reseñas</span>
            <span className="mx-1">·</span>
            <span>{`${property.address.city}, ${property.address.country}`}</span>
          </div>
          <div>
            <button className="text-gray-700 underline">Compartir</button>
            <button className="text-gray-700 underline ml-4">Guardar</button>
          </div>
        </div>

        {/* Galería de imágenes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
          {property.images && property.images.length > 0 ? (
            <>
              <div className="bg-gray-200 h-96 rounded-lg overflow-hidden">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {property.images.slice(1, 5).map((image, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 h-[11.5rem] rounded-lg overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`${property.title} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="col-span-2 bg-gray-200 h-96 rounded-lg flex items-center justify-center text-gray-400">
              No hay imágenes disponibles
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Información principal */}
          <div className="lg:col-span-2">
            <div className="border-b pb-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-semibold">
                    {`${property.propertyType} en ${property.address.city}`}
                  </h2>
                  <p className="text-gray-700">
                    {`${property.maxGuests} huéspedes · ${property.bedrooms} habitaciones · ${property.bathrooms} baño(s)`}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600">
                    {property.owner?.name?.charAt(0) || "A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-b pb-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Descripción</h3>
              <p className="text-gray-700">{property.description}</p>
            </div>

            <div className="border-b pb-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">
                Lo que ofrece este lugar
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {property.amenities &&
                  property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 mr-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                      <span>{amenity}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Reseñas */}
            <div className="border-b pb-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">
                <span className="mr-2">★</span>
                <span>
                  {property.rating} · {reviews.length} reseñas
                </span>
              </h3>

              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.slice(0, 3).map((review) => (
                    <div key={review._id} className="border-b pb-4">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                          <span>{review.user?.name?.charAt(0) || "U"}</span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {review.user?.name || "Usuario"}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center mb-2">
                        <span className="mr-1">★</span>
                        <span>{review.rating}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}

                  {reviews.length > 3 && (
                    <Button variant="outline">
                      Ver todas las {reviews.length} reseñas
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No hay reseñas todavía</p>
              )}
            </div>
          </div>

          {/* Reserva */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 shadow-lg sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-2xl font-bold">
                    €{property.pricePerNight}
                  </span>
                  <span className="text-gray-700"> noche</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-1">★</span>
                  <span>{property.rating}</span>
                  <span className="mx-1">·</span>
                  <span className="text-gray-700">
                    {property.numReviews} reseñas
                  </span>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden mb-4">
                <div className="grid grid-cols-2">
                  <div className="p-3 border-r border-b">
                    <div className="text-xs font-bold">LLEGADA</div>
                    <input
                      type="date"
                      className="w-full border-none p-0 focus:ring-0"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                    />
                  </div>
                  <div className="p-3 border-b">
                    <div className="text-xs font-bold">SALIDA</div>
                    <input
                      type="date"
                      className="w-full border-none p-0 focus:ring-0"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-xs font-bold">HUÉSPEDES</div>
                  <select
                    className="w-full border-none p-0 focus:ring-0"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                  >
                    {[...Array(property.maxGuests)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1} {i === 0 ? "huésped" : "huéspedes"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                variant="primary"
                fullWidth
                className="mb-4"
                onClick={handleBooking}
                disabled={!isAuthenticated}
              >
                {isAuthenticated ? "Reservar" : "Inicia sesión para reservar"}
              </Button>

              {!isAuthenticated && (
                <p className="text-center text-red-500 text-sm mb-4">
                  Debes iniciar sesión para realizar una reserva
                </p>
              )}

              <p className="text-center text-gray-500 text-sm mb-6">
                No se te cobrará todavía
              </p>

              {checkInDate && checkOutDate && (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="underline">
                      €{property.pricePerNight} x{" "}
                      {Math.max(
                        1,
                        Math.ceil(
                          (new Date(checkOutDate) - new Date(checkInDate)) /
                            (1000 * 60 * 60 * 24)
                        )
                      )}{" "}
                      noches
                    </span>
                    <span>
                      €
                      {property.pricePerNight *
                        Math.max(
                          1,
                          Math.ceil(
                            (new Date(checkOutDate) - new Date(checkInDate)) /
                              (1000 * 60 * 60 * 24)
                          )
                        )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="underline">Tarifa de limpieza</span>
                    <span>€50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="underline">Tarifa de servicio</span>
                    <span>
                      €
                      {Math.round(
                        property.pricePerNight *
                          Math.max(
                            1,
                            Math.ceil(
                              (new Date(checkOutDate) - new Date(checkInDate)) /
                                (1000 * 60 * 60 * 24)
                            )
                          ) *
                          0.15
                      )}
                    </span>
                  </div>
                  <div className="pt-4 border-t flex justify-between font-bold">
                    <span>Total</span>
                    <span>
                      €
                      {property.pricePerNight *
                        Math.max(
                          1,
                          Math.ceil(
                            (new Date(checkOutDate) - new Date(checkInDate)) /
                              (1000 * 60 * 60 * 24)
                          )
                        ) +
                        50 +
                        Math.round(
                          property.pricePerNight *
                            Math.max(
                              1,
                              Math.ceil(
                                (new Date(checkOutDate) -
                                  new Date(checkInDate)) /
                                  (1000 * 60 * 60 * 24)
                              )
                            ) *
                            0.15
                        )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
