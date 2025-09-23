import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProcedures } from "@/hooks/use-procedures";
import ProcedureModal from "./procedure-modal";
import { useToast } from "@/hooks/use-toast";
import type { ClientProcedure, ProviderProcedure, AdditionalProviderProcedure } from "@shared/schema";

interface ProcedureListProps {
  clientId?: string;
  providerId?: string;
  sinistroType?: string;
  type: "client" | "provider" | "additional";
}

export default function ProcedureList({ clientId, providerId, sinistroType, type }: ProcedureListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProcedure, setEditingProcedure] = useState<ClientProcedure | ProviderProcedure | AdditionalProviderProcedure | null>(null);

  const { toast } = useToast();
  
  const {
    data: procedures = [],
    isLoading,
    deleteClientProcedureMutation,
    deleteProviderProcedureMutation,
    deleteAdditionalProviderProcedureMutation
  } = useProcedures({ clientId, providerId, sinistroType, type });

  const handleEdit = (procedure: ClientProcedure | ProviderProcedure | AdditionalProviderProcedure) => {
    setEditingProcedure(procedure);
    setIsModalOpen(true);
  };

  const handleDelete = (procedure: ClientProcedure | ProviderProcedure | AdditionalProviderProcedure) => {
    if (!confirm(`Tem certeza que deseja remover o procedimento "${procedure.procedureText}"?`)) {
      return;
    }

    const onSuccess = () => {
      toast({
        title: "Sucesso",
        description: "Procedimento removido com sucesso",
      });
    };

    const onError = () => {
      toast({
        title: "Erro",
        description: "Falha ao remover procedimento",
        variant: "destructive",
      });
    };

    switch (type) {
      case "client":
        deleteClientProcedureMutation.mutate(procedure.id, { onSuccess, onError });
        break;
      case "provider":
        deleteProviderProcedureMutation.mutate(procedure.id, { onSuccess, onError });
        break;
      case "additional":
        deleteAdditionalProviderProcedureMutation.mutate(procedure.id, { onSuccess, onError });
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Carregando procedimentos...</span>
      </div>
    );
  }

  if (procedures.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum procedimento encontrado</p>
      </div>
    );
  }

  const getItemClasses = () => {
    switch (type) {
      case "additional":
        return "bg-amber-50 border-amber-200 hover:bg-amber-100";
      default:
        return "bg-muted/50 border-border hover:bg-accent/50";
    }
  };

  const getBadgeClasses = () => {
    switch (type) {
      case "additional":
        return "text-amber-700 bg-amber-200";
      default:
        return "text-primary bg-primary/10";
    }
  };

  const getButtonClasses = () => {
    switch (type) {
      case "additional":
        return {
          edit: "text-amber-600 hover:text-amber-800",
          delete: "text-amber-600 hover:text-red-600"
        };
      default:
        return {
          edit: "text-muted-foreground hover:text-primary",
          delete: "text-muted-foreground hover:text-destructive"
        };
    }
  };

  const itemClasses = getItemClasses();
  const badgeClasses = getBadgeClasses();
  const buttonClasses = getButtonClasses();

  return (
    <>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {procedures.map((procedure: any, index: number) => (
          <div
            key={procedure.id}
            className={`group flex items-center justify-between p-3 rounded-md border transition-colors ${itemClasses}`}
          >
            <div className="flex items-center space-x-3">
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${badgeClasses}`}>
                {index + 1}
              </span>
              <span className="text-sm text-foreground">{procedure.procedureText}</span>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className={`p-1 h-auto ${buttonClasses.edit}`}
                onClick={() => handleEdit(procedure)}
                data-testid={`button-edit-procedure-${procedure.id}`}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`p-1 h-auto ${buttonClasses.delete}`}
                onClick={() => handleDelete(procedure)}
                data-testid={`button-delete-procedure-${procedure.id}`}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ProcedureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="procedure"
        clientId={clientId}
        providerId={providerId}
        sinistroType={sinistroType}
        procedureType={type}
        editingProcedure={editingProcedure}
      />
    </>
  );
}
