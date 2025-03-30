import { useInfiniteQuery } from '@tanstack/react-query';
import { getUsers } from '../services/index.tsx';

const useUsers = (params: { limit: number; searchTerm: string; silent?: boolean }) => { // Agregar silent opcional
    return useInfiniteQuery({
        queryKey: ['users', params.searchTerm, params.limit],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await getUsers({
                page: pageParam,
                limit: params.limit,
                searchTerm: params.searchTerm,
                silent: params.silent // Pasar silent desde los params
            });

            if (!response.success) {
                throw new Error(response.message || 'Error al obtener usuarios');
            }

            return response;
        },
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.hasMore ? allPages.length + 1 : undefined;
        },
        initialPageParam: 1,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false
    });
};

export default useUsers;