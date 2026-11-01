import type { StatusLeito } from "./leito";

export interface HistoricoLeito {
  id: number;
  statusAnterior: StatusLeito | null;
  statusNovo: StatusLeito;
  usuarioNome: string | null;
  registradoEm: string;
}
