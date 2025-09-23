import { useState } from "react";
import { Building, Plus, Edit, Image, Trash2, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useProviders } from "@/hooks/use-providers";
import { sinistroTypes } from "@shared/schema";
import ProcedureList from "./procedure-list";
import ProcedureModal from "./procedure-modal";
import { useToast } from "@/hooks/use-toast";
import type { Provider } from "@shared/schema";

export default function ProviderManager() {
  const [selectedProviderId, setSelectedProviderId] = useState<string>("");
  const [selectedSinistroType, setSelectedSinistroType] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"provider" | "procedure" | "additional-procedure">("provider");
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);

  const { toast } = useToast();
  const { 
    data: providers = [], 
    isLoading: providersLoading,
    createProviderMutation,
    updateProviderMutation,
    deleteProviderMutation
  } = useProviders();

  const selectedProvider = providers.find((p: Provider) => p.id === selectedProviderId);
  const selectedSinistro = sinistroTypes.find(s => s.value === selectedSinistroType);

  const handleProviderChange = (value: string) => {
    setSelectedProviderId(value);
  };

  const handleSinistroChange = (value: string) => {
    setSelectedSinistroType(value);
  };

  const handleAddProvider = () => {
    setEditingProvider(null);
    setModalType("provider");
    setIsModalOpen(true);
  };

  const handleEditProvider = () => {
    if (!selectedProvider) {
      toast({
        title: "Erro",
        description: "Selecione um prestador primeiro",
        variant: "destructive",
      });
      return;
    }
    setEditingProvider(selectedProvider);
    setModalType("provider");
    setIsModalOpen(true);
  };

  const handleEditProviderImage = () => {
    if (!selectedProvider) {
      toast({
        title: "Erro",
        description: "Selecione um prestador primeiro",
        variant: "destructive",
      });
      return;
    }
    // For now, just show a simple prompt
    const newImage = prompt("Digite a URL da imagem:", selectedProvider.image || "");
    if (newImage !== null) {
      updateProviderMutation.mutate({
        id: selectedProvider.id,
        data: { image: newImage }
      }, {
        onSuccess: () => {
          toast({
            title: "Sucesso",
            description: "Imagem do prestador atualizada com sucesso",
          });
        },
        onError: () => {
          toast({
            title: "Erro",
            description: "Falha ao atualizar imagem do prestador",
            variant: "destructive",
          });
        }
      });
    }
  };

  const handleDeleteProvider = () => {
    if (!selectedProvider) {
      toast({
        title: "Erro",
        description: "Selecione um prestador primeiro",
        variant: "destructive",
      });
      return;
    }
    
    if (confirm(`Tem certeza que deseja excluir o prestador "${selectedProvider.name}"?`)) {
      deleteProviderMutation.mutate(selectedProvider.id, {
        onSuccess: () => {
          toast({
            title: "Sucesso",
            description: "Prestador excluído com sucesso",
          });
          setSelectedProviderId("");
        },
        onError: () => {
          toast({
            title: "Erro",
            description: "Falha ao excluir prestador",
            variant: "destructive",
          });
        }
      });
    }
  };

  const handleProviderSubmit = (data: { name: string; image?: string }) => {
    if (editingProvider) {
      updateProviderMutation.mutate({
        id: editingProvider.id,
        data
      }, {
        onSuccess: () => {
          toast({
            title: "Sucesso",
            description: "Prestador atualizado com sucesso",
          });
          setIsModalOpen(false);
        },
        onError: () => {
          toast({
            title: "Erro",
            description: "Falha ao atualizar prestador",
            variant: "destructive",
          });
        }
      });
    } else {
      createProviderMutation.mutate(data, {
        onSuccess: () => {
          toast({
            title: "Sucesso",
            description: "Prestador criado com sucesso",
          });
          setIsModalOpen(false);
        },
        onError: () => {
          toast({
            title: "Erro",
            description: "Falha ao criar prestador",
            variant: "destructive",
          });
        }
      });
    }
  };

  const handleAddProcedure = () => {
    if (!selectedProviderId || !selectedSinistroType) {
      toast({
        title: "Erro",
        description: "Selecione um prestador e tipo de sinistro primeiro",
        variant: "destructive",
      });
      return;
    }
    setModalType("procedure");
    setIsModalOpen(true);
  };

  const handleAddAdditionalProcedure = () => {
    if (!selectedProviderId || !selectedSinistroType) {
      toast({
        title: "Erro",
        description: "Selecione um prestador e tipo de sinistro primeiro",
        variant: "destructive",
      });
      return;
    }
    setModalType("additional-procedure");
    setIsModalOpen(true);
  };

  if (providersLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Carregando...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground flex items-center">
              <Building className="mr-2 h-5 w-5 text-primary" />
              Gestão de Prestadores
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="providerSelect" className="text-sm font-medium text-foreground mb-2">
                Selecionar Prestador
              </Label>
              <Select value={selectedProviderId} onValueChange={handleProviderChange}>
                <SelectTrigger data-testid="select-provider">
                  <SelectValue placeholder="-- Escolha um prestador --" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider: Provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={handleAddProvider}
                data-testid="button-add-provider"
              >
                <Plus className="mr-1 h-4 w-4" />
                Adicionar
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleEditProvider}
                data-testid="button-edit-provider"
              >
                <Edit className="mr-1 h-4 w-4" />
                Editar
              </Button>
              <Button 
                variant="outline" 
                onClick={handleEditProviderImage}
                data-testid="button-edit-provider-image"
              >
                <Image className="mr-1 h-4 w-4" />
                Imagem
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteProvider}
                data-testid="button-delete-provider"
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Excluir
              </Button>
            </div>

            <div>
              <Label htmlFor="sinistroSelect" className="text-sm font-medium text-foreground mb-2">
                Tipo de Sinistro
              </Label>
              <Select value={selectedSinistroType} onValueChange={handleSinistroChange}>
                <SelectTrigger data-testid="select-sinistro">
                  <SelectValue placeholder="-- Escolha um tipo de sinistro --" />
                </SelectTrigger>
                <SelectContent>
                  {sinistroTypes.map((sinistro) => (
                    <SelectItem key={sinistro.value} value={sinistro.value}>
                      {sinistro.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedProviderId && selectedSinistroType && (
        <>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <Star className="mr-2 h-5 w-5 text-amber-500" />
                  Procedimentos AON
                  {selectedSinistro && (
                    <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-800">
                      {selectedSinistro.label}
                    </Badge>
                  )}
                </h3>
              </div>

              <ProcedureList 
                providerId={selectedProviderId}
                sinistroType={selectedSinistroType}
                type="additional"
              />

              <Button 
                className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white" 
                onClick={handleAddAdditionalProcedure}
                data-testid="button-add-additional-procedure"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Procedimento AON
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <div className="mr-2 h-5 w-5 text-primary">⚙</div>
                  Procedimentos - Demais Clientes
                </h3>
              </div>

              <ProcedureList 
                providerId={selectedProviderId}
                sinistroType={selectedSinistroType}
                type="provider"
              />

              <Button 
                className="w-full mt-4" 
                onClick={handleAddProcedure}
                data-testid="button-add-provider-procedure"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Procedimento
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      <ProcedureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        providerId={selectedProviderId}
        sinistroType={selectedSinistroType}
        procedureType={modalType === "additional-procedure" ? "additional" : "provider"}
        editingItem={editingProvider}
        onSubmit={modalType === "provider" ? handleProviderSubmit : undefined}
      />
    </div>
  );
}
