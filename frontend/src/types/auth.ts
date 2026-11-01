import type { Role } from "./usuario";

export interface Sessao {
  token: string;
  usuarioId: number;
  nome: string;
  role: Role;
}
