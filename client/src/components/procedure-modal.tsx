import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProcedures } from "@/hooks/use-procedures";
import { useToast } from "@/hooks/use-toast";
import type { Client, Provider, ClientProcedure, ProviderProcedure, AdditionalProviderProcedure } from "@shared/schema";

interface ProcedureModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "client" | "provider" | "procedure" | "additional-procedure";
  clientId?: string;
  providerId?: string;
  sinistroType?: string;
  procedureType?: "client" | "provider" | "additional";
  editingItem?: Client | Provider | null;
  editingProcedure?: ClientProcedure | ProviderProcedure | AdditionalProviderProcedure | null;
  onSubmit?: (data: any) => void;
}

const clientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
});

const providerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  image: z.string().optional(),
});

const procedureSchema = z.object({
  procedureText: z.string().min(1, "Texto do procedimento é obrigatório"),
});

export default function ProcedureModal({
  isOpen,
  onClose,
  type,
  clientId,
  providerId,
  sinistroType,
  procedureType,
  editingItem,
  editingProcedure,
  onSubmit,
}: ProcedureModalProps) {
  const { toast } = useToast();
  
  const {
    createClientProcedureMutation,
    updateClientProcedureMutation,
    createProviderProcedureMutation,
    updateProviderProcedureMutation,
    createAdditionalProviderProcedureMutation,
    updateAdditionalProviderProcedureMutation
  } = useProcedures({ clientId, providerId, sinistroType, type: procedureType });

  const getSchema = () => {
    switch (type) {
      case "client":
        return clientSchema;
      case "provider":
        return providerSchema;
      default:
        return procedureSchema;
    }
  };

  const form = useForm({
    resolver: zodResolver(getSchema()),
    defaultValues: getDefaultValues() as any,
  });

  function getDefaultValues() {
    if (editingItem) {
      if (type === "client") {
        return { name: editingItem.name };
      } else if (type === "provider") {
        return { 
          name: editingItem.name, 
          image: (editingItem as Provider).image || ""
        };
      }
    }
    
    if (editingProcedure) {
      return { procedureText: editingProcedure.procedureText };
    }

    return type === "provider" 
      ? { name: "", image: "" }
      : type === "client"
      ? { name: "" }
      : { procedureText: "" };
  }

  useEffect(() => {
    form.reset(getDefaultValues() as any);
  }, [editingItem, editingProcedure, type]);

  const handleSubmit = (data: any) => {
    if (onSubmit) {
      onSubmit(data);
      return;
    }

    // Handle procedure submissions
    if (type === "procedure" || type === "additional-procedure") {
      const procedureData = {
        procedureText: data.procedureText,
        ...(clientId && { clientId }),
        ...(providerId && { providerId }),
        ...(sinistroType && { sinistroType }),
      };

      const onSuccess = () => {
        toast({
          title: "Sucesso",
          description: `Procedimento ${editingProcedure ? 'atualizado' : 'criado'} com sucesso`,
        });
        onClose();
      };

      const onError = () => {
        toast({
          title: "Erro",
          description: `Falha ao ${editingProcedure ? 'atualizar' : 'criar'} procedimento`,
          variant: "destructive",
        });
      };

      if (editingProcedure) {
        // Update procedure
        switch (procedureType) {
          case "client":
            updateClientProcedureMutation.mutate({
              id: editingProcedure.id,
              data: { procedureText: data.procedureText }
            }, { onSuccess, onError });
            break;
          case "provider":
            updateProviderProcedureMutation.mutate({
              id: editingProcedure.id,
              data: { procedureText: data.procedureText }
            }, { onSuccess, onError });
            break;
          case "additional":
            updateAdditionalProviderProcedureMutation.mutate({
              id: editingProcedure.id,
              data: { procedureText: data.procedureText }
            }, { onSuccess, onError });
            break;
        }
      } else {
        // Create procedure
        if (type === "additional-procedure") {
          createAdditionalProviderProcedureMutation.mutate(procedureData, { onSuccess, onError });
        } else if (clientId) {
          createClientProcedureMutation.mutate(procedureData, { onSuccess, onError });
        } else if (providerId) {
          createProviderProcedureMutation.mutate(procedureData, { onSuccess, onError });
        }
      }
    }
  };

  const getTitle = () => {
    const action = (editingItem || editingProcedure) ? "Editar" : "Adicionar";
    
    switch (type) {
      case "client":
        return `${action} Cliente`;
      case "provider":
        return `${action} Prestador`;
      case "additional-procedure":
        return `${action} Procedimento AON`;
      default:
        return `${action} Procedimento`;
    }
  };

  const getSubmitText = () => {
    return (editingItem || editingProcedure) ? "Atualizar" : "Criar";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{getTitle()}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              data-testid="button-close-modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {type === "client" && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Cliente</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Digite o nome do cliente" 
                        {...field} 
                        data-testid="input-client-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {type === "provider" && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Prestador</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Digite o nome do prestador" 
                          {...field}
                          data-testid="input-provider-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem (opcional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Digite a URL da imagem" 
                          {...field}
                          data-testid="input-provider-image"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {(type === "procedure" || type === "additional-procedure") && (
              <FormField
                control={form.control}
                name="procedureText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texto do Procedimento</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Digite o texto do procedimento" 
                        {...field}
                        data-testid="input-procedure-text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex space-x-3 pt-4">
              <Button 
                type="button" 
                variant="secondary" 
                className="flex-1" 
                onClick={onClose}
                data-testid="button-cancel"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                data-testid="button-submit"
              >
                {getSubmitText()}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
