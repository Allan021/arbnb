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
    defaultValues: {
      checkInDate,
      checkOutDate,
      guestCount,
    },
  });

  const onSubmit = () => {
    handleBooking();
  };

  return (
    <div className="lg:col-span-1">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border rounded-lg p-6 shadow-lg sticky top-24"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-2xl font-bold">
              ${property.pricePerNight}
            </span>
            <span className="text-gray-700"> noche</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">★</span>
            <span>{property.rating}</span>
            <span className="mx-1">·</span>
            <span className="text-gray-700">{property.numReviews} reseñas</span>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden mb-4">
          <div className="grid grid-cols-2">
            <div className="p-3 border-r border-b">
              <div className="text-xs font-bold">LLEGADA</div>
              <input
                type="date"
                {...register("checkInDate")}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full border-none p-0 focus:ring-0"
              />
              {errors.checkInDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.checkInDate.message as string}
                </p>
              )}
            </div>
            <div className="p-3 border-b">
              <div className="text-xs font-bold">SALIDA</div>
              <input
                type="date"
                {...register("checkOutDate")}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full border-none p-0 focus:ring-0"
              />
              {errors.checkOutDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.checkOutDate.message as string}
                </p>
              )}
            </div>
          </div>
          <div className="p-3">
            <div className="text-xs font-bold">HUÉSPEDES</div>
            <select
              {...register("guestCount", { valueAsNumber: true })}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="w-full border-none p-0 focus:ring-0"
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

        {nights > 0 && (
          <div className="space-y-4">
            <PriceRow
              label={`$${property.pricePerNight} x ${nights} noches`}
              value={`$${property.pricePerNight * nights}`}
            />
            <PriceRow label="Tarifa de limpieza" value="$50" />
            <PriceRow label="Tarifa de servicio" value={`$${serviceFee}`} />
            <div className="pt-4 border-t flex justify-between font-bold">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
