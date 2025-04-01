export interface Property {
    _id: string;
    title: string;
    description: string;
    images: string[];
    pricePerNight: number;
    propertyType: 'Apartment' | 'House' | 'Unique space' | 'Boutique hotel';
    bedrooms: number;
    bathrooms: number;
    maxGuests: number;
    amenities: string[];
    rating: number;
    numReviews: number;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    owner: {
        _id: string;
        name: string;
        email: string;
    };
}
