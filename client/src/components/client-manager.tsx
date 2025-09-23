import { useState } from "react";
import { Users, Plus, Edit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClients } from "@/hooks/use-clients";
import { useProcedures } from "@/hooks/use-procedures";
import ProcedureList from "./procedure-list";
import ProcedureModal from "./procedure-modal";
import { useToast } from "@/hooks/use-toast";
import type { Client } from "@shared/schema";

export default function ClientManager() {
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"client" | "procedure">("client");
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const { toast } = useToast();
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const { 
    createClientMutation, 
    updateClientMutation 
  } = useClients();

  const selectedClient = clients.find((c: Client) => c.id === selectedClientId);

  const handleClientChange = (value: string) => {
    setSelectedClientId(value);
  };

  const handleAddClient = () => {
    setEditingClient(null);
    setModalType("client");
    setIsModalOpen(true);
  };

  const handleEditClient = () => {
    if (!selectedClient) {
      toast({
        title: "Erro",
        description: "Selecione um cliente primeiro",
        variant: "destructive",
      });
      return;
    }
    setEditingClient(selectedClient);
    setModalType("client");
    setIsModalOpen(true);
  };

  const handleClientSubmit = (data: { name: string }) => {
    if (editingClient) {
      updateClientMutation.mutate({
        id: editingClient.id,
        data: { name: data.name }
      }, {
        onSuccess: () => {
          toast({
            title: "Sucesso",
            description: "Cliente atualizado com sucesso",
          });
          setIsModalOpen(false);
        },
        onError: () => {
          toast({
            title: "Erro",
            description: "Falha ao atualizar cliente",
            variant: "destructive",
          });
        }
      });
    } else {
      createClientMutation.mutate({ name: data.name }, {
        onSuccess: () => {
          toast({
            title: "Sucesso",
            description: "Cliente criado com sucesso",
          });
          setIsModalOpen(false);
        },
        onError: () => {
          toast({
            title: "Erro",
            description: "Falha ao criar cliente",
            variant: "destructive",
          });
        }
      });
    }
  };

  const handleAddProcedure = () => {
    if (!selectedClientId) {
      toast({
        title: "Erro",
        description: "Selecione um cliente primeiro",
        variant: "destructive",
      });
      return;
    }
    setModalType("procedure");
    setIsModalOpen(true);
  };

  if (clientsLoading) {
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
              <Users className="mr-2 h-5 w-5 text-primary" />
              Gestão de Clientes
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="clientSelect" className="text-sm font-medium text-foreground mb-2">
                Selecionar Cliente
              </Label>
              <Select value={selectedClientId} onValueChange={handleClientChange}>
                <SelectTrigger data-testid="select-client">
                  <SelectValue placeholder="-- Escolha um cliente --" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client: Client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              <Button 
                className="flex-1" 
                onClick={handleAddClient}
                data-testid="button-add-client"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
              <Button 
                variant="secondary" 
                className="flex-1" 
                onClick={handleEditClient}
                data-testid="button-edit-client"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedClientId && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center">
                <div className="mr-2 h-5 w-5 text-primary">✓</div>
                Procedimentos do Cliente
              </h3>
            </div>

            <ProcedureList 
              clientId={selectedClientId} 
              type="client"
            />

            <Button 
              className="w-full mt-4" 
              onClick={handleAddProcedure}
              data-testid="button-add-procedure"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Procedimento
            </Button>
          </CardContent>
        </Card>
      )}

      <ProcedureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        clientId={selectedClientId}
        procedureType="client"
        editingItem={editingClient}
        onSubmit={modalType === "client" ? handleClientSubmit : undefined}
      />
    </div>
  );
}
