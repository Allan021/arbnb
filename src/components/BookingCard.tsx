"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PriceRow } from "@/components/ui/price-row";
import Button from "@/components/Button";
import { Property } from "@/models/Property";

const today = new Date().toISOString().split("T")[0];

const schema = z
  .object({
    checkInDate: z.string().min(1, "Requerido"),
    checkOutDate: z.string().min(1, "Requerido"),
    guestCount: z.number().min(1, "Al menos 1 huésped"),
  })
  .refine((data) => new Date(data.checkInDate) >= new Date(today), {
    message: "La fecha de entrada no puede ser en el pasado",
    path: ["checkInDate"],
  })
  .refine((data) => new Date(data.checkOutDate) > new Date(data.checkInDate), {
    message: "La fecha de salida debe ser posterior a la de entrada",
    path: ["checkOutDate"],
  });

type BookingFormProps = {
  property: Property;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  nights: number;
  serviceFee: number;
  totalPrice: number;
  isAuthenticated: boolean;
  setCheckInDate: (value: string) => void;
  setCheckOutDate: (value: string) => void;
  setGuestCount: (value: number) => void;
  handleBooking: () => void;
};

export function BookingForm({
  property,
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
}: BookingFormProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur", // Errores se muestran al hacer blur
    defaultValues: {
      checkInDate,
      checkOutDate,
      guestCount,
    },
  });

  const onSubmit = () => {
    handleBooking();
  };

  const dynamicNightlyPrice = property.pricePerNight * Math.max(guestCount, 1);
  const dynamicTotal = dynamicNightlyPrice * nights + 50 + serviceFee;

  return (
    <div className="lg:col-span-1">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border rounded-xl p-6 shadow-xl sticky top-24 bg-white"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-2xl font-bold text-gray-800">
              COP$ {property.pricePerNight}
            </span>
            <span className="text-gray-500"> / noche</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-1">★</span>
            <span>{property.rating}</span>
            <span className="mx-1">·</span>
            <span>{property.numReviews} reseñas</span>
          </div>
        </div>

        {/* Campos de fecha y huéspedes */}
        <div className="border rounded-lg overflow-hidden mb-4 divide-y divide-gray-200">
          <div className="grid grid-cols-2 gap-0">
            <div className="p-3 border-r">
              <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                Llegada
              </label>
              <input
                type="date"
                {...register("checkInDate")}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 text-sm px-3 py-2 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
              {errors.checkInDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.checkInDate.message as string}
                </p>
              )}
            </div>

            <div className="p-3">
              <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                Salida
              </label>
              <input
                type="date"
                {...register("checkOutDate")}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 text-sm px-3 py-2 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
              {errors.checkOutDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.checkOutDate.message as string}
                </p>
              )}
            </div>
          </div>

          <div className="p-3">
            <label className="text-xs font-bold text-gray-600 block mb-1">
              HUÉSPEDES
            </label>
            <select
              {...register("guestCount", { valueAsNumber: true })}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="w-full text-sm text-gray-800 border-none p-0 focus:ring-0"
            >
              {[...Array(property.maxGuests)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1} {i === 0 ? "huésped" : "huéspedes"}
                </option>
              ))}
            </select>
            {errors.guestCount && (
              <p className="text-red-500 text-xs mt-1">
                {errors.guestCount.message as string}
              </p>
            )}
          </div>
        </div>

        {/* Botón de reserva */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          className="mb-4"
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

        {/* Precios dinámicos */}
        {nights > 0 && (
          <div className="space-y-4">
            <PriceRow
              label={`$${property.pricePerNight} x ${guestCount} huésped(es) x ${nights} noche(s)`}
              value={`$${dynamicNightlyPrice * nights}`}
            />
            <PriceRow label="Tarifa de limpieza" value="$50" />
            <PriceRow label="Tarifa de servicio" value={`$${serviceFee}`} />
            <div className="pt-4 border-t flex justify-between font-bold">
              <span>Total</span>
              <span>${dynamicTotal}</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
