export type StatusLeito = "DISPONIVEL" | "OCUPADO" | "LIMPEZA" | "BLOQUEADO";

export interface Leito {
  id: number;
  codigo: string;
  status: StatusLeito;
  enfermariaId: number;
  enfermariaNome: string;
  blocoId: number;
  blocoNome: string;
  atualizadoEm: string;
  atualizadoPorNome: string | null;
}

export interface LeitoRequest {
  codigo: string;
  enfermariaId: number;
}
