import { useEffect, useState } from "react";
import { reviewService } from "@/lib/api";
import { Review } from "@/models/Review";

export function usePropertyReviews(propertyId: string) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [errorReviews, setErrorReviews] = useState("");

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await reviewService.getPropertyReviews(propertyId);
                setReviews(response);
            } catch (error) {
                console.error(error);
                setErrorReviews("Error al cargar las reseñas");
            } finally {
                setLoadingReviews(false);
            }
        };

        fetchReviews();
    }, [propertyId]);

    return {
        reviews,
        loadingReviews,
        errorReviews,
    };
}
