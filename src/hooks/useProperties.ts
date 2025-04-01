import { Property } from '@/models/Property';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useProperties = () => {
    return useQuery<Property[]>({
        queryKey: ['properties'],
        queryFn: async () => {
            const { data } = await axios.get<{ properties: Property[] }>(`${API_URL}/properties`);
            return data.properties;
        },
    });
};
