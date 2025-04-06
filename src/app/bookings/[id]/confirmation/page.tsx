"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { useAuth } from "@/lib/AuthContext";
import { bookingService } from "@/lib/api";

export default function BookingConfirmationPage({
  params,
}: {
  params: { id: string };
}) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchBookingDetails = async () => {
      try {
        const bookingData = await bookingService.getBookingById(params.id);
        setBooking(bookingData);
      } catch (err) {
        setError("Error al cargar los detalles de la reserva");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [params.id, isAuthenticated, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col">
        <Header isLoggedIn={isAuthenticated} />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <p>Cargando detalles de la reserva...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="flex min-h-screen flex-col">
        <Header isLoggedIn={isAuthenticated} />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">
              {error || "No se pudo encontrar la reserva"}
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
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-green-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Reserva confirmada!
            </h1>
            <p className="text-gray-600">
              Tu reserva ha sido procesada correctamente.
            </p>
          </div>

          <div className="border-t border-b py-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Detalles de la reserva
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700">Número de reserva</h3>
                <p>{booking._id}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Estado</h3>
                <p className="capitalize">{booking.status}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Fechas</h3>
                <p>
                  {new Date(booking.checkInDate).toLocaleDateString()} -{" "}
                  {new Date(booking.checkOutDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Huéspedes</h3>
                <p>{booking.guestCount} huéspedes</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Propiedad</h3>
                <p>{booking.property?.title || "Propiedad"}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Ubicación</h3>
                <p>
                  {booking.property?.address?.city || "Ciudad"},{" "}
                  {booking.property?.address?.country || "País"}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Precio total</h3>
                <p className="font-bold">${booking.totalPrice}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Pago</h3>
                <p>{booking.isPaid ? "Pagado" : "Pendiente"}</p>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Recibirás un correo electrónico con todos los detalles de tu
              reserva.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/bookings")}
              >
                Ver mis reservas
              </Button>
              <Button variant="primary" onClick={() => router.push("/")}>
                Volver al inicio
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
