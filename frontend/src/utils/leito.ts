import type { StatusLeito } from "../types/leito";

export const STATUS_LEITO: StatusLeito[] = ["DISPONIVEL", "OCUPADO", "LIMPEZA", "BLOQUEADO"];

export const ROTULO_STATUS: Record<StatusLeito, string> = {
  DISPONIVEL: "Disponível",
  OCUPADO: "Ocupado",
  LIMPEZA: "Em limpeza",
  BLOQUEADO: "Bloqueado",
};

export function classeStatus(status: StatusLeito): string {
  return `status-${status.toLowerCase()}`;
}
