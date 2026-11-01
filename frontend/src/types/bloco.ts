export interface Bloco {
  id: number;
  nome: string;
  descricao: string | null;
}

export interface BlocoRequest {
  nome: string;
  descricao: string;
}
