import { useState, useMemo } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useProperty } from "@/hooks/useProperty";
import { usePropertyReviews } from "../usePropertiesReviews";

export function usePropertyDetail(propertyId: string) {
    const { property, loadingProperty, errorProperty } = useProperty(propertyId);
    const { reviews, loadingReviews } = usePropertyReviews(propertyId);
    const { isAuthenticated } = useAuth();

    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [guestCount, setGuestCount] = useState(1);

    const nights = useMemo(() => {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const diff = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        return isNaN(diff) || diff <= 0 ? 0 : diff;
    }, [checkInDate, checkOutDate]);

    const serviceFee = useMemo(() => {
        if (!property) return 0;
        return Math.round(property.pricePerNight * nights * 0.15);
    }, [property, nights]);

    const totalPrice = useMemo(() => {
        if (!property || nights === 0) return 0;
        return property.pricePerNight * nights + 50 + serviceFee;
    }, [property, nights, serviceFee]);

    const handleBooking = () => {
        const url = `/properties/${propertyId}/book?checkIn=${checkInDate}&checkOut=${checkOutDate}&guests=${guestCount}&nights=${nights}`;
        window.location.href = url;
    };

    return {
        property,
        reviews,
        loading: loadingProperty || loadingReviews,
        error: errorProperty,
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
    };
}
