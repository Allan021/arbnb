export interface Review {
    _id: string;
    user: {
        _id: string;
        name: string;
    };
    property: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
}
