import { useEffect, useState } from "react";
import { propertyService } from "@/lib/api";
import { Property } from "@/models/Property";

export function useProperty(propertyId: string) {
    const [property, setProperty] = useState<Property | null>(null);
    const [loadingProperty, setLoadingProperty] = useState(true);
    const [errorProperty, setErrorProperty] = useState("");

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await propertyService.getPropertyById(propertyId);
                setProperty(response);
            } catch (error) {
                console.error(error);
                setErrorProperty("Error al cargar la propiedad");
            } finally {
                setLoadingProperty(false);
            }
        };

        fetchProperty();
    }, [propertyId]);

    return {
        property,
        loadingProperty,
        errorProperty,
    };
}
