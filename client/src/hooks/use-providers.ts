import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import type { Provider, InsertProvider } from "@shared/schema";

export function useProviders() {
  const query = useQuery<Provider[]>({
    queryKey: ["/api/providers"],
  });

  const createProviderMutation = useMutation({
    mutationFn: async (data: InsertProvider) => {
      const response = await apiRequest("POST", "/api/providers", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/providers"] });
    },
  });

  const updateProviderMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertProvider> }) => {
      const response = await apiRequest("PUT", `/api/providers/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/providers"] });
    },
  });

  const deleteProviderMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/providers/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/providers"] });
    },
  });

  return {
    ...query,
    createProviderMutation,
    updateProviderMutation,
    deleteProviderMutation,
  };
}
