"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useAuth } from "@/lib/AuthContext";
import { propertyService, bookingService } from "@/lib/api";
import MainLayout from "@/components/ui/main-layout";

export default function BookingPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingData, setBookingData] = useState({
    checkInDate: "",
    checkOutDate: "",
    guestCount: 1,
    nights: 1,
    totalPrice: 0,
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    cardName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const { isAuthenticated, loading: authLoading } = useAuth();
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
    } else {
      setAuthChecked(true);
    }
  }, [isAuthenticated, authLoading, router]);
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const propertyData = await propertyService.getPropertyById(id);
        setProperty(propertyData);

        const checkIn = searchParams.get("checkIn");
        const checkOut = searchParams.get("checkOut");
        const guests = searchParams.get("guests");
        const nights = searchParams.get("nights");

        if (checkIn && checkOut && guests && nights) {
          const totalPrice = calculateTotalPrice(
            propertyData.pricePerNight,
            parseInt(nights)
          );

          setBookingData({
            checkInDate: checkIn,
            checkOutDate: checkOut,
            guestCount: parseInt(guests),
            nights: parseInt(nights),
            totalPrice,
          });
        }
      } catch (err) {
        setError("Error al cargar los detalles de la propiedad");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (authChecked) fetchPropertyDetails();
  }, [authChecked, id, searchParams]);

  const calculateTotalPrice = (pricePerNight: number, nights: number) => {
    const subtotal = pricePerNight * nights;
    const cleaningFee = 50;
    const serviceFee = Math.round(subtotal * 0.15);
    return subtotal + cleaningFee + serviceFee;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo({ ...paymentInfo, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const bookingPayload = {
        propertyId: params.id,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        totalPrice: bookingData.totalPrice,
        guestCount: bookingData.guestCount,
      };

      const response = await bookingService.createBooking(bookingPayload);
      await bookingService.updateBookingToPaid(response._id);
      router.push(`/bookings/${response._id}/confirmation`);
    } catch (err) {
      setError("Error al procesar la reserva. Por favor, inténtalo de nuevo.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authChecked || loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <p>Cargando detalles de la reserva...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !property) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 flex-grow">
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
        <h1 className="text-2xl font-bold mb-6">Confirmar y pagar</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="border-b pb-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Tu viaje</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Fechas</h3>
                  <p className="text-gray-600">
                    {new Date(bookingData.checkInDate).toLocaleDateString()} -{" "}
                    {new Date(bookingData.checkOutDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Huéspedes</h3>
                  <p className="text-gray-600">
                    {bookingData.guestCount} huéspedes
                  </p>
                </div>
              </div>
            </div>

            <div className="border-b pb-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Información de pago
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex space-x-2">
                  <div className="border rounded p-2 flex items-center">
                    <span>Tarjeta de crédito</span>
                  </div>
                  <div className="border rounded p-2 flex items-center">
                    <span>PayPal</span>
                  </div>
                </div>

                <Input
                  id="cardNumber"
                  name="cardNumber"
                  label="Número de tarjeta"
                  placeholder="1234 5678 9012 3456"
                  value={paymentInfo.cardNumber}
                  onChange={handleInputChange}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="expiry"
                    label="Fecha de caducidad"
                    placeholder="MM/AA"
                    value={paymentInfo.expiry}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    id="cvc"
                    label="CVC"
                    placeholder="123"
                    value={paymentInfo.cvc}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Input
                  id="cardName"
                  label="Nombre en la tarjeta"
                  placeholder="Juan Pérez"
                  value={paymentInfo.cardName}
                  onChange={handleInputChange}
                  required
                />

                <div className="border-t pt-6 mt-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Política de cancelación
                  </h2>
                  <p className="text-gray-700">
                    Cancelación gratuita por 48 horas. Después, cancelación
                    gratuita hasta 5 días antes de la llegada. Cancelación
                    parcial (50%) hasta 24 horas antes de la llegada.
                  </p>
                </div>

                <div className="flex items-center mb-6">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-[#FF385C] focus:ring-[#FF385C] border-gray-300 rounded"
                    required
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Acepto los{" "}
                    <a href="#" className="text-[#FF385C]">
                      términos y condiciones
                    </a>{" "}
                    y la{" "}
                    <a href="#" className="text-[#FF385C]">
                      política de privacidad
                    </a>
                  </label>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Procesando..." : "Confirmar y pagar"}
                </Button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 shadow-lg sticky top-24">
              <div className="flex items-start space-x-4 pb-6 mb-6 border-b">
                <div className="relative w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                  {property.images?.[0] ? (
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Imagen
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{property.title}</h3>
                  <p className="text-gray-600">
                    {property.address.city}, {property.address.country}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-4">
                Detalles del precio
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>
                    €{property.pricePerNight} x {bookingData.nights} noches
                  </span>
                  <span>€{property.pricePerNight * bookingData.nights}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tarifa de limpieza</span>
                  <span>€50</span>
                </div>
                <div className="flex justify-between">
                  <span>Tarifa de servicio</span>
                  <span>
                    €
                    {Math.round(
                      property.pricePerNight * bookingData.nights * 0.15
                    )}
                  </span>
                </div>
                <div className="pt-4 border-t flex justify-between font-bold">
                  <span>Total</span>
                  <span>€{bookingData.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
