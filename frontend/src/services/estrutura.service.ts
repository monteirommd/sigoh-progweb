import type { Bloco, BlocoRequest } from "../types/bloco";
import type { Enfermaria, EnfermariaRequest } from "../types/enfermaria";
import { requisitar } from "./api";

export const blocoService = {
  listar: () => requisitar<Bloco[]>("/api/blocos"),
  buscar: (id: number) => requisitar<Bloco>(`/api/blocos/${id}`),
  criar: (dados: BlocoRequest) => requisitar<Bloco>("/api/blocos", "POST", dados),
  atualizar: (id: number, dados: BlocoRequest) => requisitar<Bloco>(`/api/blocos/${id}`, "PUT", dados),
  excluir: (id: number) => requisitar<void>(`/api/blocos/${id}`, "DELETE"),
};

export const enfermariaService = {
  listar: (blocoId?: number) =>
    requisitar<Enfermaria[]>(blocoId ? `/api/enfermarias?blocoId=${blocoId}` : "/api/enfermarias"),
  buscar: (id: number) => requisitar<Enfermaria>(`/api/enfermarias/${id}`),
  criar: (dados: EnfermariaRequest) => requisitar<Enfermaria>("/api/enfermarias", "POST", dados),
  atualizar: (id: number, dados: EnfermariaRequest) =>
    requisitar<Enfermaria>(`/api/enfermarias/${id}`, "PUT", dados),
  excluir: (id: number) => requisitar<void>(`/api/enfermarias/${id}`, "DELETE"),
};
