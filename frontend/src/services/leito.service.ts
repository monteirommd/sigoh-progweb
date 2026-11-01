import type { HistoricoLeito } from "../types/historico";
import type { Leito, LeitoRequest, StatusLeito } from "../types/leito";
import { requisitar } from "./api";

interface FiltroLeitos {
  blocoId?: number;
  enfermariaId?: number;
}

function montarFiltro({ blocoId, enfermariaId }: FiltroLeitos): string {
  const params = new URLSearchParams();
  if (blocoId) params.set("blocoId", String(blocoId));
  if (enfermariaId) params.set("enfermariaId", String(enfermariaId));
  const texto = params.toString();
  return texto ? `?${texto}` : "";
}

export const leitoService = {
  listar: (filtro: FiltroLeitos = {}) => requisitar<Leito[]>(`/api/leitos${montarFiltro(filtro)}`),
  criar: (dados: LeitoRequest) => requisitar<Leito>("/api/leitos", "POST", dados),
  atualizar: (id: number, dados: LeitoRequest) => requisitar<Leito>(`/api/leitos/${id}`, "PUT", dados),
  excluir: (id: number) => requisitar<void>(`/api/leitos/${id}`, "DELETE"),
  alterarStatus: (id: number, status: StatusLeito) =>
    requisitar<Leito>(`/api/leitos/${id}/status`, "PATCH", { status }),
  historico: (id: number) => requisitar<HistoricoLeito[]>(`/api/leitos/${id}/historico`),
};
