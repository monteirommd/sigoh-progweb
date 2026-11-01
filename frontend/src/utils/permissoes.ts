import type { Role } from "../types/usuario";

export const ROTULO_PAPEL: Record<Role, string> = {
  ADMIN: "Administrador",
  GESTAO: "Gestão",
  TECNICO: "Técnico",
  VISITANTE: "Visitante",
};

export const PAPEIS_PAINEL: Role[] = ["ADMIN", "GESTAO", "VISITANTE"];

export function rotaInicial(role: Role): string {
  return role === "TECNICO" ? "/tecnico" : "/painel";
}

export function podeAlterarStatus(role: Role): boolean {
  return role !== "VISITANTE";
}

export function ehAdmin(role: Role): boolean {
  return role === "ADMIN";
}
