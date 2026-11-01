import { useCallback, useEffect, useState, type ReactNode } from "react";
import { definirAoExpirarSessao, definirToken } from "../services/api";
import { authService } from "../services/auth.service";
import type { Sessao } from "../types/auth";
import { AuthContext } from "./auth-context";

const CHAVE_SESSAO = "sigoh:sessao";

function carregarSessao(): Sessao | null {
  try {
    const salva = sessionStorage.getItem(CHAVE_SESSAO);
    const sessao = salva ? (JSON.parse(salva) as Sessao) : null;
    definirToken(sessao?.token ?? null);
    return sessao;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Sessao | null>(carregarSessao);

  const sair = useCallback(() => {
    definirToken(null);
    sessionStorage.removeItem(CHAVE_SESSAO);
    setSessao(null);
  }, []);

  const entrar = useCallback(async (email: string, senha: string) => {
    const nova = await authService.login(email, senha);
    definirToken(nova.token);
    sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(nova));
    setSessao(nova);
    return nova;
  }, []);

  useEffect(() => {
    definirAoExpirarSessao(sair);
  }, [sair]);

  return <AuthContext.Provider value={{ sessao, entrar, sair }}>{children}</AuthContext.Provider>;
}
