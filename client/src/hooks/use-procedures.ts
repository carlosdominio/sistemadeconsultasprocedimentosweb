import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import type { 
  ClientProcedure, 
  ProviderProcedure, 
  AdditionalProviderProcedure,
  InsertClientProcedure,
  InsertProviderProcedure,
  InsertAdditionalProviderProcedure
} from "@shared/schema";

interface UseProceduresOptions {
  clientId?: string;
  providerId?: string;
  sinistroType?: string;
  type?: "client" | "provider" | "additional";
}

export function useProcedures(options: UseProceduresOptions = {}) {
  const { clientId, providerId, sinistroType, type } = options;

  // Build query key based on type
  const getQueryKey = () => {
    if (type === "client" && clientId) {
      return ["/api/clients", clientId, "procedures"];
    } else if (type === "provider" && providerId && sinistroType) {
      return ["/api/providers", providerId, "procedures", sinistroType];
    } else if (type === "additional" && providerId && sinistroType) {
      return ["/api/providers", providerId, "additional-procedures", sinistroType];
    }
    return null;
  };

  const queryKey = getQueryKey();

  const query = useQuery<ClientProcedure[] | ProviderProcedure[] | AdditionalProviderProcedure[]>({
    queryKey: queryKey || ["procedures", "disabled"],
    enabled: !!queryKey,
  });

  // Client procedure mutations
  const createClientProcedureMutation = useMutation({
    mutationFn: async (data: InsertClientProcedure) => {
      const response = await apiRequest("POST", `/api/clients/${data.clientId}/procedures`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients", clientId, "procedures"] });
    },
  });

  const updateClientProcedureMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertClientProcedure> }) => {
      const response = await apiRequest("PUT", `/api/procedures/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients", clientId, "procedures"] });
    },
  });

  const deleteClientProcedureMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/procedures/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients", clientId, "procedures"] });
    },
  });

  // Provider procedure mutations
  const createProviderProcedureMutation = useMutation({
    mutationFn: async (data: InsertProviderProcedure) => {
      const response = await apiRequest("POST", `/api/providers/${data.providerId}/procedures`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/providers", providerId, "procedures", sinistroType] });
    },
  });

  const updateProviderProcedureMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertProviderProcedure> }) => {
      const response = await apiRequest("PUT", `/api/provider-procedures/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/providers", providerId, "procedures", sinistroType] });
    },
  });

  const deleteProviderProcedureMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/provider-procedures/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/providers", providerId, "procedures", sinistroType] });
    },
  });

  // Additional provider procedure mutations
  const createAdditionalProviderProcedureMutation = useMutation({
    mutationFn: async (data: InsertAdditionalProviderProcedure) => {
      const response = await apiRequest("POST", `/api/providers/${data.providerId}/additional-procedures`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/providers", providerId, "additional-procedures", sinistroType] });
    },
  });

  const updateAdditionalProviderProcedureMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertAdditionalProviderProcedure> }) => {
      const response = await apiRequest("PUT", `/api/additional-provider-procedures/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/providers", providerId, "additional-procedures", sinistroType] });
    },
  });

  const deleteAdditionalProviderProcedureMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/additional-provider-procedures/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/providers", providerId, "additional-procedures", sinistroType] });
    },
  });

  return {
    ...query,
    createClientProcedureMutation,
    updateClientProcedureMutation,
    deleteClientProcedureMutation,
    createProviderProcedureMutation,
    updateProviderProcedureMutation,
    deleteProviderProcedureMutation,
    createAdditionalProviderProcedureMutation,
    updateAdditionalProviderProcedureMutation,
    deleteAdditionalProviderProcedureMutation,
  };
}
