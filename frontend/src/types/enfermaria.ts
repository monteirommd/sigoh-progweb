export interface Enfermaria {
  id: number;
  nome: string;
  descricao: string | null;
  blocoId: number;
  blocoNome: string;
}

export interface EnfermariaRequest {
  nome: string;
  descricao: string;
  blocoId: number;
}
