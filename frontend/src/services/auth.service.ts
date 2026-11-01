import type { Sessao } from "../types/auth";
import { requisitar } from "./api";

export const authService = {
  login: (email: string, senha: string) => requisitar<Sessao>("/auth/login", "POST", { email, senha }),
};
