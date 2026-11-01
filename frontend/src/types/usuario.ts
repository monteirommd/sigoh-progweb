export type Role = "ADMIN" | "GESTAO" | "TECNICO" | "VISITANTE";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: Role;
  criadoEm: string;
}

export interface UsuarioRequest {
  nome: string;
  email: string;
  senha: string | null;
  role: Role;
}
