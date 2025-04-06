"use client";

import MainLayout from "@/components/ui/main-layout";
import { use } from "react";
import { usePropertyDetail } from "@/hooks/properties/usePropertiesDetail";
import { BookingForm } from "@/components/BookingCard";
import { MosaicGalleryWithPreviewModal } from "@/components/ui/gallery";

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const {
    property,
    reviews,
    loading,
    error,
    checkInDate,
    checkOutDate,
    guestCount,
    nights,
    serviceFee,
    totalPrice,
    isAuthenticated,
    setCheckInDate,
    setCheckOutDate,
    setGuestCount,
    handleBooking,
  } = usePropertyDetail(id);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex-grow flex items-center justify-center">
          <p>Cargando detalles de la propiedad...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !property) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || "No se pudo encontrar la propiedad"}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
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
        <MosaicGalleryWithPreviewModal
          images={property.images}
          title={property.title}
        />

        {/* Información general y reserva */}
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
                {property.amenities?.map((amenity, index) => (
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
                </div>
              ) : (
                <p className="text-gray-500">No hay reseñas todavía</p>
              )}
            </div>
          </div>

          {/* Tarjeta de reserva */}
          <BookingForm
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            guestCount={guestCount}
            setCheckInDate={setCheckInDate}
            setCheckOutDate={setCheckOutDate}
            setGuestCount={setGuestCount}
            handleBooking={handleBooking}
            property={property}
            nights={nights}
            serviceFee={serviceFee}
            totalPrice={totalPrice}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
    </MainLayout>
  );
}
