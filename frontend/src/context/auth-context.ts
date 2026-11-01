import { createContext } from "react";
import type { Sessao } from "../types/auth";

export interface AuthContextData {
  sessao: Sessao | null;
  entrar: (email: string, senha: string) => Promise<Sessao>;
  sair: () => void;
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);
